const Account = require("../models/Account");
const Transaction = require("../models/Transaction");
const { getStatus } = require("../config/db");
const memoryStore = require("../data/memoryStore");
const seedAccounts = require("../data/seedAccounts");
const bcrypt = require("bcryptjs");

// @desc    Get all savings accounts
// @route   GET /api/accounts
exports.getAccounts = async (req, res) => {
  try {
    if (!getStatus()) {
      const accounts = memoryStore.getAccounts();
      return res.status(200).json({ success: true, count: accounts.length, data: accounts });
    }

    const accounts = await Account.find({}).select("-pin").sort({ createdAt: -1 });
    res.status(200).json({ success: true, count: accounts.length, data: accounts });
  } catch (error) {
    console.error("Error in getAccounts:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get account details by Account Number
// @route   GET /api/accounts/:accountNumber
exports.getAccountByNumber = async (req, res) => {
  try {
    const { accountNumber } = req.params;

    if (!getStatus()) {
      const acc = memoryStore.getAccountByNumber(accountNumber);
      if (!acc) {
        return res.status(404).json({ success: false, message: "Account not found" });
      }
      const { pinHash, ...safe } = acc;
      return res.status(200).json({ success: true, data: safe });
    }

    const acc = await Account.findOne({ accountNumber }).select("-pin");
    if (!acc) {
      return res.status(404).json({ success: false, message: "Account not found" });
    }

    res.status(200).json({ success: true, data: acc });
  } catch (error) {
    console.error("Error in getAccountByNumber:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Verify genuine account holder with Account Number + Security PIN
// @route   POST /api/accounts/verify-holder
exports.verifyHolder = async (req, res) => {
  try {
    const { accountNumber, pin } = req.body;

    if (!accountNumber || !pin) {
      return res.status(400).json({
        success: false,
        message: "Please provide both Account Number and 4-digit Security PIN",
      });
    }

    if (!getStatus()) {
      const acc = memoryStore.getAccountByNumber(accountNumber);
      if (!acc) {
        return res.status(404).json({ success: false, message: "Account number not found" });
      }

      const isValid = memoryStore.verifyHolderPin(acc, pin);
      if (!isValid) {
        return res.status(401).json({ success: false, message: "Security PIN verification failed! Access denied." });
      }

      const { pinHash, ...safe } = acc;
      return res.status(200).json({
        success: true,
        message: "Genuine Account Holder authenticated successfully!",
        data: safe,
      });
    }

    // MongoDB flow
    const acc = await Account.findOne({ accountNumber }).select("+pin");
    if (!acc) {
      return res.status(404).json({ success: false, message: "Account number not found" });
    }

    const isMatch = await acc.matchPin(String(pin));
    if (!isMatch) {
      return res.status(401).json({ success: false, message: "Security PIN verification failed! Access denied." });
    }

    const safeAcc = acc.toObject();
    delete safeAcc.pin;

    res.status(200).json({
      success: true,
      message: "Genuine Account Holder authenticated successfully!",
      data: safeAcc,
    });
  } catch (error) {
    console.error("Error in verifyHolder:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Open a new savings account
// @route   POST /api/accounts
exports.createAccount = async (req, res) => {
  try {
    const { holderName, email, phone, governmentId, pin, initialDeposit, accountType } = req.body;

    if (!holderName || !email || !phone || !governmentId || !pin) {
      return res.status(400).json({
        success: false,
        message: "Please provide all required account holder KYC details and 4-digit PIN",
      });
    }

    if (String(pin).length < 4) {
      return res.status(400).json({ success: false, message: "Security PIN must be at least 4 digits" });
    }

    const minDeposit = 100.0;
    const deposit = Number(initialDeposit) || minDeposit;
    if (deposit < minDeposit) {
      return res.status(400).json({
        success: false,
        message: `Savings Account opening requires a minimum initial deposit of $${minDeposit.toFixed(2)}`,
      });
    }

    if (!getStatus()) {
      const created = memoryStore.createAccount({
        holderName,
        email,
        phone,
        governmentId,
        pin,
        initialDeposit: deposit,
        accountType,
      });
      return res.status(201).json({
        success: true,
        message: "Savings Account opened successfully for verified genuine holder!",
        data: created,
      });
    }

    // MongoDB flow
    const existing = await Account.findOne({ email });
    if (existing) {
      return res.status(400).json({ success: false, message: "An account with this email already exists" });
    }

    const random8 = Math.floor(10000000 + Math.random() * 90000000);
    const accountNumber = `SB-${random8}`;

    const newAcc = await Account.create({
      accountNumber,
      holderName,
      email,
      phone,
      governmentId,
      pin,
      balance: deposit,
      minimumBalance: minDeposit,
      accountType: accountType || "High-Yield Savings",
      kycVerified: true,
      status: "Active",
    });

    // Record initial deposit transaction
    await Transaction.create({
      transactionId: `TXN-${Math.floor(100000 + Math.random() * 900000)}-01`,
      accountId: newAcc._id,
      accountNumber,
      type: "Initial_Deposit",
      amount: deposit,
      balanceBefore: 0,
      balanceAfter: deposit,
      status: "Completed",
      description: "Savings Account initial opening deposit",
      initiatedBy: `${holderName} (Genuine Holder)`,
    });

    const safeAcc = newAcc.toObject();
    delete safeAcc.pin;

    res.status(201).json({
      success: true,
      message: "Savings Account opened successfully for verified genuine holder!",
      data: safeAcc,
    });
  } catch (error) {
    console.error("Error in createAccount:", error);
    res.status(400).json({ success: false, message: error.message });
  }
};

// @desc    Toggle account status (Active / Frozen)
// @route   PATCH /api/accounts/:accountNumber/status
exports.updateAccountStatus = async (req, res) => {
  try {
    const { accountNumber } = req.params;
    const { status } = req.body;

    if (!["Active", "Frozen", "Closed"].includes(status)) {
      return res.status(400).json({ success: false, message: "Invalid status value" });
    }

    if (!getStatus()) {
      const updated = memoryStore.updateStatus(accountNumber, status);
      return res.status(200).json({ success: true, message: `Account marked as ${status}`, data: updated });
    }

    const updated = await Account.findOneAndUpdate(
      { accountNumber },
      { status },
      { new: true }
    ).select("-pin");

    if (!updated) {
      return res.status(404).json({ success: false, message: "Account not found" });
    }

    res.status(200).json({ success: true, message: `Account marked as ${status}`, data: updated });
  } catch (error) {
    console.error("Error in updateAccountStatus:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Reset Demo Accounts
// @route   POST /api/accounts/reset
exports.resetDemo = async (req, res) => {
  try {
    if (!getStatus()) {
      const accounts = memoryStore.resetDemo();
      return res.status(200).json({ success: true, message: "Demo accounts reset successfully!", count: accounts.length });
    }

    await Account.deleteMany({});
    await Transaction.deleteMany({});

    for (const accData of seedAccounts) {
      const created = await Account.create({
        accountNumber: accData.accountNumber,
        holderName: accData.holderName,
        email: accData.email,
        phone: accData.phone,
        governmentId: accData.governmentId,
        pin: accData.pin,
        balance: accData.balance,
        minimumBalance: accData.minimumBalance,
        accountType: accData.accountType,
        interestRate: accData.interestRate,
        kycVerified: accData.kycVerified,
        status: accData.status,
      });

      if (accData.recentTransactions) {
        for (const t of accData.recentTransactions) {
          await Transaction.create({
            ...t,
            accountId: created._id,
            accountNumber: created.accountNumber,
          });
        }
      }
    }

    res.status(200).json({ success: true, message: "Demo accounts and transactions re-seeded successfully!" });
  } catch (error) {
    console.error("Error in resetDemo:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

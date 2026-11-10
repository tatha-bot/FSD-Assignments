const Account = require("../models/Account");
const Transaction = require("../models/Transaction");
const { getStatus } = require("../config/db");
const memoryStore = require("../data/memoryStore");

// @desc    Deposit funds into a Savings Account
// @route   POST /api/transactions/deposit
exports.deposit = async (req, res) => {
  try {
    const { accountNumber, pin, amount, description } = req.body;

    if (!accountNumber || !pin || amount === undefined) {
      return res.status(400).json({
        success: false,
        message: "Please provide Account Number, Security PIN, and Deposit Amount",
      });
    }

    const numAmount = Number(amount);
    if (isNaN(numAmount) || numAmount <= 0) {
      return res.status(400).json({ success: false, message: "Deposit amount must be a positive number greater than 0" });
    }

    if (!getStatus()) {
      const result = memoryStore.deposit(accountNumber, pin, numAmount, description);
      return res.status(200).json({
        success: true,
        message: `Successfully deposited $${numAmount.toFixed(2)} into savings account ${accountNumber}!`,
        data: {
          accountNumber,
          newBalance: result.account.balance,
          transaction: result.transaction,
        },
      });
    }

    // MongoDB flow
    const account = await Account.findOne({ accountNumber }).select("+pin");
    if (!account) {
      return res.status(404).json({ success: false, message: "Account not found" });
    }

    if (account.status !== "Active") {
      return res.status(403).json({ success: false, message: `Account is ${account.status}. Deposits cannot be processed.` });
    }

    // Verify Genuine Holder PIN
    const isPinValid = await account.matchPin(String(pin));
    if (!isPinValid) {
      return res.status(401).json({
        success: false,
        message: "Security PIN verification failed! Authorization rejected.",
      });
    }

    const balanceBefore = account.balance;
    const balanceAfter = Number((balanceBefore + numAmount).toFixed(2));

    account.balance = balanceAfter;
    await account.save();

    const txn = await Transaction.create({
      transactionId: `TXN-${Math.floor(100000 + Math.random() * 900000)}-DEP`,
      accountId: account._id,
      accountNumber,
      type: "Deposit",
      amount: numAmount,
      balanceBefore,
      balanceAfter,
      status: "Completed",
      description: description || "Funds Deposit to Savings Account",
      initiatedBy: `${account.holderName} (Genuine Holder Verified)`,
    });

    res.status(200).json({
      success: true,
      message: `Successfully deposited $${numAmount.toFixed(2)} into savings account ${accountNumber}!`,
      data: {
        accountNumber,
        newBalance: balanceAfter,
        transaction: txn,
      },
    });
  } catch (error) {
    console.error("Error in deposit:", error);
    res.status(400).json({ success: false, message: error.message });
  }
};

// @desc    Withdraw funds from a Savings Account
// @route   POST /api/transactions/withdraw
exports.withdraw = async (req, res) => {
  try {
    const { accountNumber, pin, amount, description } = req.body;

    if (!accountNumber || !pin || amount === undefined) {
      return res.status(400).json({
        success: false,
        message: "Please provide Account Number, Security PIN, and Withdrawal Amount",
      });
    }

    const numAmount = Number(amount);
    if (isNaN(numAmount) || numAmount <= 0) {
      return res.status(400).json({ success: false, message: "Withdrawal amount must be a positive number greater than 0" });
    }

    if (!getStatus()) {
      const result = memoryStore.withdraw(accountNumber, pin, numAmount, description);
      return res.status(200).json({
        success: true,
        message: `Successfully withdrew $${numAmount.toFixed(2)} from savings account ${accountNumber}!`,
        data: {
          accountNumber,
          newBalance: result.account.balance,
          transaction: result.transaction,
        },
      });
    }

    // MongoDB flow
    const account = await Account.findOne({ accountNumber }).select("+pin");
    if (!account) {
      return res.status(404).json({ success: false, message: "Account not found" });
    }

    if (account.status !== "Active") {
      return res.status(403).json({
        success: false,
        message: `Account is currently ${account.status}. Withdrawals are suspended.`,
      });
    }

    // Verify Genuine Holder PIN
    const isPinValid = await account.matchPin(String(pin));
    if (!isPinValid) {
      return res.status(401).json({
        success: false,
        message: "Security PIN verification failed! Withdrawal request unauthorized.",
      });
    }

    // Daily limit check
    if ((account.withdrawnToday || 0) + numAmount > account.dailyWithdrawalLimit) {
      return res.status(400).json({
        success: false,
        message: `Exceeds daily withdrawal limit of $${account.dailyWithdrawalLimit.toFixed(2)}.`,
      });
    }

    // Savings Account Minimum Balance Rule
    const availableToWithdraw = account.balance - account.minimumBalance;
    if (numAmount > availableToWithdraw) {
      return res.status(400).json({
        success: false,
        message: `Insufficient funds. Savings accounts must maintain a mandatory minimum balance of $${account.minimumBalance.toFixed(
          2
        )}. Max available for withdrawal: $${Math.max(0, availableToWithdraw).toFixed(2)}`,
      });
    }

    const balanceBefore = account.balance;
    const balanceAfter = Number((balanceBefore - numAmount).toFixed(2));

    account.balance = balanceAfter;
    account.withdrawnToday = Number(((account.withdrawnToday || 0) + numAmount).toFixed(2));
    await account.save();

    const txn = await Transaction.create({
      transactionId: `TXN-${Math.floor(100000 + Math.random() * 900000)}-WTH`,
      accountId: account._id,
      accountNumber,
      type: "Withdrawal",
      amount: numAmount,
      balanceBefore,
      balanceAfter,
      status: "Completed",
      description: description || "Funds Withdrawal via Genuine Holder PIN",
      initiatedBy: `${account.holderName} (Genuine Holder Verified)`,
    });

    res.status(200).json({
      success: true,
      message: `Successfully withdrew $${numAmount.toFixed(2)} from savings account ${accountNumber}!`,
      data: {
        accountNumber,
        newBalance: balanceAfter,
        transaction: txn,
      },
    });
  } catch (error) {
    console.error("Error in withdraw:", error);
    res.status(400).json({ success: false, message: error.message });
  }
};

// @desc    Get transactions / passbook history
// @route   GET /api/transactions
exports.getTransactions = async (req, res) => {
  try {
    const { accountNumber } = req.query;

    if (!getStatus()) {
      const txns = memoryStore.getTransactions(accountNumber);
      return res.status(200).json({ success: true, count: txns.length, data: txns });
    }

    let filter = {};
    if (accountNumber) filter.accountNumber = accountNumber;

    const txns = await Transaction.find(filter).sort({ createdAt: -1 });
    res.status(200).json({ success: true, count: txns.length, data: txns });
  } catch (error) {
    console.error("Error in getTransactions:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

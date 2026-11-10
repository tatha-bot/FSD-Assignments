const bcrypt = require("bcryptjs");
const seedAccounts = require("./seedAccounts");

let inMemoryAccounts = [];
let inMemoryTransactions = [];

const initialize = () => {
  inMemoryAccounts = seedAccounts.map((acc, idx) => ({
    _id: `acc_${idx + 1}`,
    accountNumber: acc.accountNumber,
    holderName: acc.holderName,
    email: acc.email,
    phone: acc.phone,
    governmentId: acc.governmentId,
    pinHash: bcrypt.hashSync(acc.pin, 8),
    plainPinForDemo: acc.pin, // Handy for demo display
    balance: Number(acc.balance),
    minimumBalance: Number(acc.minimumBalance || 100),
    accountType: acc.accountType,
    interestRate: acc.interestRate,
    kycVerified: acc.kycVerified,
    status: acc.status,
    dailyWithdrawalLimit: Number(acc.dailyWithdrawalLimit || 5000),
    withdrawnToday: Number(acc.withdrawnToday || 0),
    createdAt: new Date(Date.now() - 86400000 * 30).toISOString(),
    updatedAt: new Date().toISOString(),
  }));

  inMemoryTransactions = [];
  seedAccounts.forEach((acc, idx) => {
    if (acc.recentTransactions) {
      acc.recentTransactions.forEach((txn, tIdx) => {
        inMemoryTransactions.push({
          _id: `txn_${idx + 1}_${tIdx + 1}`,
          transactionId: txn.transactionId,
          accountId: `acc_${idx + 1}`,
          accountNumber: acc.accountNumber,
          type: txn.type,
          amount: Number(txn.amount),
          balanceBefore: Number(txn.balanceBefore),
          balanceAfter: Number(txn.balanceAfter),
          status: txn.status,
          description: txn.description,
          initiatedBy: txn.initiatedBy,
          createdAt: txn.createdAt,
        });
      });
    }
  });
};

initialize();

const memoryStore = {
  getAccounts: () => {
    return inMemoryAccounts.map((a) => {
      const { pinHash, ...safeCopy } = a;
      return safeCopy;
    });
  },

  getAccountByNumber: (accountNumber) => {
    return inMemoryAccounts.find((a) => a.accountNumber === accountNumber) || null;
  },

  verifyHolderPin: (account, enteredPin) => {
    if (!account) return false;
    return bcrypt.compareSync(String(enteredPin), account.pinHash);
  },

  createAccount: ({ holderName, email, phone, governmentId, pin, initialDeposit, accountType }) => {
    const minBal = 100.0;
    const depositAmount = Number(initialDeposit) || minBal;

    if (depositAmount < minBal) {
      throw new Error(`Minimum opening deposit for a Savings Account is $${minBal.toFixed(2)}`);
    }

    // Check unique email
    const exists = inMemoryAccounts.find((a) => a.email.toLowerCase() === email.toLowerCase());
    if (exists) {
      throw new Error("An account is already registered with this email address");
    }

    // Generate unique account number
    const random8 = Math.floor(10000000 + Math.random() * 90000000);
    const accountNumber = `SB-${random8}`;

    const newAcc = {
      _id: `acc_${Date.now()}`,
      accountNumber,
      holderName,
      email: email.toLowerCase(),
      phone,
      governmentId,
      pinHash: bcrypt.hashSync(String(pin), 8),
      plainPinForDemo: String(pin),
      balance: depositAmount,
      minimumBalance: minBal,
      accountType: accountType || "High-Yield Savings",
      interestRate: 3.85,
      kycVerified: true,
      status: "Active",
      dailyWithdrawalLimit: 5000.0,
      withdrawnToday: 0.0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    inMemoryAccounts.push(newAcc);

    // Initial Deposit Transaction
    const txn = {
      _id: `txn_${Date.now()}`,
      transactionId: `TXN-${Math.floor(100000 + Math.random() * 900000)}-01`,
      accountId: newAcc._id,
      accountNumber,
      type: "Initial_Deposit",
      amount: depositAmount,
      balanceBefore: 0.0,
      balanceAfter: depositAmount,
      status: "Completed",
      description: "Savings Account opening deposit",
      initiatedBy: `${holderName} (Genuine Holder)`,
      createdAt: new Date().toISOString(),
    };
    inMemoryTransactions.unshift(txn);

    const { pinHash, ...safeAcc } = newAcc;
    return safeAcc;
  },

  deposit: (accountNumber, enteredPin, amount, description) => {
    const acc = inMemoryAccounts.find((a) => a.accountNumber === accountNumber);
    if (!acc) throw new Error("Account not found");

    if (acc.status !== "Active") {
      throw new Error(`Cannot deposit into ${acc.status} account`);
    }

    const isValidPin = bcrypt.compareSync(String(enteredPin), acc.pinHash);
    if (!isValidPin) {
      throw new Error("Invalid Security PIN. Authorization rejected.");
    }

    const numAmount = Number(amount);
    if (isNaN(numAmount) || numAmount <= 0) {
      throw new Error("Deposit amount must be greater than zero");
    }

    const balanceBefore = acc.balance;
    const balanceAfter = Number((balanceBefore + numAmount).toFixed(2));
    acc.balance = balanceAfter;
    acc.updatedAt = new Date().toISOString();

    const txn = {
      _id: `txn_${Date.now()}`,
      transactionId: `TXN-${Math.floor(100000 + Math.random() * 900000)}-DEP`,
      accountId: acc._id,
      accountNumber,
      type: "Deposit",
      amount: numAmount,
      balanceBefore,
      balanceAfter,
      status: "Completed",
      description: description || "Cash/Wire Deposit to Savings Account",
      initiatedBy: `${acc.holderName} (Genuine Holder Verified)`,
      createdAt: new Date().toISOString(),
    };

    inMemoryTransactions.unshift(txn);
    return { account: acc, transaction: txn };
  },

  withdraw: (accountNumber, enteredPin, amount, description) => {
    const acc = inMemoryAccounts.find((a) => a.accountNumber === accountNumber);
    if (!acc) throw new Error("Account not found");

    if (acc.status !== "Active") {
      throw new Error(`Account is currently ${acc.status}. Withdrawals are suspended.`);
    }

    const isValidPin = bcrypt.compareSync(String(enteredPin), acc.pinHash);
    if (!isValidPin) {
      throw new Error("Security PIN verification failed! Withdrawal request unauthorized.");
    }

    const numAmount = Number(amount);
    if (isNaN(numAmount) || numAmount <= 0) {
      throw new Error("Withdrawal amount must be greater than zero");
    }

    // Daily limit check
    if (acc.withdrawnToday + numAmount > acc.dailyWithdrawalLimit) {
      throw new Error(
        `Exceeds daily withdrawal limit of $${acc.dailyWithdrawalLimit.toFixed(2)}. Remaining today: $${(
          acc.dailyWithdrawalLimit - acc.withdrawnToday
        ).toFixed(2)}`
      );
    }

    // Minimum balance rule for savings account
    const availableToWithdraw = acc.balance - acc.minimumBalance;
    if (numAmount > availableToWithdraw) {
      throw new Error(
        `Insufficient funds. Savings Accounts must maintain a mandatory minimum balance of $${acc.minimumBalance.toFixed(
          2
        )}. Max available to withdraw: $${Math.max(0, availableToWithdraw).toFixed(2)}`
      );
    }

    const balanceBefore = acc.balance;
    const balanceAfter = Number((balanceBefore - numAmount).toFixed(2));
    acc.balance = balanceAfter;
    acc.withdrawnToday = Number((acc.withdrawnToday + numAmount).toFixed(2));
    acc.updatedAt = new Date().toISOString();

    const txn = {
      _id: `txn_${Date.now()}`,
      transactionId: `TXN-${Math.floor(100000 + Math.random() * 900000)}-WTH`,
      accountId: acc._id,
      accountNumber,
      type: "Withdrawal",
      amount: numAmount,
      balanceBefore,
      balanceAfter,
      status: "Completed",
      description: description || "Funds Withdrawal via Genuine Holder PIN",
      initiatedBy: `${acc.holderName} (Genuine Holder Verified)`,
      createdAt: new Date().toISOString(),
    };

    inMemoryTransactions.unshift(txn);
    return { account: acc, transaction: txn };
  },

  getTransactions: (accountNumber = null) => {
    if (accountNumber) {
      return inMemoryTransactions.filter((t) => t.accountNumber === accountNumber);
    }
    return inMemoryTransactions;
  },

  updateStatus: (accountNumber, status) => {
    const acc = inMemoryAccounts.find((a) => a.accountNumber === accountNumber);
    if (!acc) throw new Error("Account not found");
    acc.status = status;
    acc.updatedAt = new Date().toISOString();
    return acc;
  },

  resetDemo: () => {
    initialize();
    return inMemoryAccounts;
  },
};

module.exports = memoryStore;

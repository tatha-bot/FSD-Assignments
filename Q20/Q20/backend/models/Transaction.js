const mongoose = require("mongoose");

const transactionSchema = new mongoose.Schema(
  {
    transactionId: {
      type: String,
      required: true,
      unique: true,
    },
    accountId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Account",
      required: true,
    },
    accountNumber: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      enum: ["Deposit", "Withdrawal", "Initial_Deposit", "Interest_Credit"],
      required: true,
    },
    amount: {
      type: Number,
      required: [true, "Transaction amount is required"],
      min: [1, "Amount must be greater than zero"],
    },
    balanceBefore: {
      type: Number,
      required: true,
    },
    balanceAfter: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      enum: ["Completed", "Failed", "Reversed"],
      default: "Completed",
    },
    description: {
      type: String,
      default: "Bank Account Transaction",
    },
    initiatedBy: {
      type: String,
      default: "Genuine Account Holder",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Transaction", transactionSchema);

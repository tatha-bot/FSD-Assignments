const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const accountSchema = new mongoose.Schema(
  {
    accountNumber: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    holderName: {
      type: String,
      required: [true, "Account holder name is required"],
      trim: true,
    },
    email: {
      type: String,
      required: [true, "Email address is required"],
      unique: true,
      lowercase: true,
      trim: true,
    },
    phone: {
      type: String,
      required: [true, "Phone number is required"],
      trim: true,
    },
    governmentId: {
      type: String,
      required: [true, "Government ID / Passport / SSN is required for KYC"],
      trim: true,
    },
    pin: {
      type: String,
      required: [true, "4-digit security PIN is required"],
      select: false, // Don't return pin in standard queries
    },
    balance: {
      type: Number,
      required: true,
      default: 500,
      min: [100, "Savings Account requires a minimum balance of $100.00"],
    },
    minimumBalance: {
      type: Number,
      default: 100.0,
    },
    accountType: {
      type: String,
      enum: ["High-Yield Savings", "Standard Savings", "Student Savings"],
      default: "High-Yield Savings",
    },
    interestRate: {
      type: Number,
      default: 3.85, // 3.85% APY
    },
    kycVerified: {
      type: Boolean,
      default: true, // Marked genuine account holder upon verified KYC
    },
    status: {
      type: String,
      enum: ["Active", "Frozen", "Closed"],
      default: "Active",
    },
    dailyWithdrawalLimit: {
      type: Number,
      default: 5000.0,
    },
    withdrawnToday: {
      type: Number,
      default: 0.0,
    },
  },
  {
    timestamps: true,
  }
);

// Hash PIN prior to saving
accountSchema.pre("save", async function (next) {
  if (!this.isModified("pin")) return next();
  const salt = await bcrypt.genSalt(10);
  this.pin = await bcrypt.hash(this.pin, salt);
  next();
});

// Compare PIN helper
accountSchema.methods.matchPin = async function (enteredPin) {
  return await bcrypt.compare(enteredPin, this.pin);
};

module.exports = mongoose.model("Account", accountSchema);

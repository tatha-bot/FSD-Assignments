const mongoose = require('mongoose');

const salaryPaymentSchema = new mongoose.Schema({
  paymentId: {
    type: String,
    required: true,
    unique: true
  },
  employeeId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Employee',
    required: true
  },
  empId: {
    type: String,
    required: true
  },
  employeeName: {
    type: String,
    required: true
  },
  role: {
    type: String,
    required: true
  },
  department: {
    type: String,
    required: true
  },
  periodType: {
    type: String,
    enum: ['Daily', 'Weekly', 'Custom Range'],
    default: 'Daily'
  },
  startDate: {
    type: String,
    required: true
  },
  endDate: {
    type: String,
    required: true
  },
  dailyWageRate: {
    type: Number,
    required: true
  },
  overtimeHourlyRate: {
    type: Number,
    default: 0
  },
  daysPresent: {
    type: Number,
    default: 0
  },
  halfDays: {
    type: Number,
    default: 0
  },
  daysAbsent: {
    type: Number,
    default: 0
  },
  totalOvertimeHours: {
    type: Number,
    default: 0
  },
  baseWage: {
    type: Number,
    required: true
  },
  overtimeWage: {
    type: Number,
    default: 0
  },
  hospitalAllowance: {
    type: Number,
    default: 0
  },
  deductions: {
    type: Number,
    default: 0
  },
  netPayable: {
    type: Number,
    required: true
  },
  paymentMethod: {
    type: String,
    enum: [
      'Hospital Cash Counter',
      'UPI Instant Pay',
      'Bank Transfer (NEFT/IMPS)',
      'Cheque'
    ],
    default: 'Hospital Cash Counter'
  },
  paymentStatus: {
    type: String,
    enum: ['Paid', 'Pending', 'Processing', 'Cancelled'],
    default: 'Paid'
  },
  transactionReference: {
    type: String,
    default: () => 'TXN-' + Math.random().toString(36).substring(2, 9).toUpperCase()
  },
  disbursedAt: {
    type: Date,
    default: Date.now
  },
  disbursedBy: {
    type: String,
    default: 'Hospital Payroll Officer'
  },
  notes: {
    type: String,
    default: ''
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('SalaryPayment', salaryPaymentSchema);

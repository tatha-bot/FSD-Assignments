const mongoose = require('mongoose');

const employeeSchema = new mongoose.Schema({
  empId: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  name: {
    type: String,
    required: true,
    trim: true
  },
  role: {
    type: String,
    required: true,
    enum: [
      'Ward Boy',
      'Housekeeping / Sanitation',
      'Stretcher Bearer',
      'Security Guard',
      'Ayah / Caretaker',
      'Maintenance / Electrician',
      'Laundry Staff',
      'Dietary / Canteen Staff',
      'Lab Attendant'
    ],
    default: 'Ward Boy'
  },
  department: {
    type: String,
    required: true,
    enum: [
      'Emergency & Trauma',
      'Intensive Care Unit (ICU)',
      'Housekeeping & Sanitation',
      'General Wards',
      'Operation Theatre (OT)',
      'Security & Safety',
      'Dietary & Nutrition',
      'Maintenance & Facilities'
    ],
    default: 'General Wards'
  },
  phone: {
    type: String,
    required: true
  },
  dailyWageRate: {
    type: Number,
    required: true,
    min: 0
  },
  overtimeHourlyRate: {
    type: Number,
    required: true,
    min: 0
  },
  shift: {
    type: String,
    enum: [
      'Morning (06:00 - 14:00)',
      'Evening (14:00 - 22:00)',
      'Night (22:00 - 06:00)',
      'General (09:00 - 17:00)'
    ],
    default: 'General (09:00 - 17:00)'
  },
  bankAccount: {
    accountNumber: { type: String, default: '' },
    ifscCode: { type: String, default: '' },
    bankName: { type: String, default: '' },
    upiId: { type: String, default: '' }
  },
  status: {
    type: String,
    enum: ['Active', 'Inactive'],
    default: 'Active'
  },
  joinedDate: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Employee', employeeSchema);

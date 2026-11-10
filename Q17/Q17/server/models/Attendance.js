const mongoose = require('mongoose');

const attendanceSchema = new mongoose.Schema({
  date: {
    type: String, // Format: YYYY-MM-DD
    required: true,
    index: true
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
  department: {
    type: String,
    required: true
  },
  status: {
    type: String,
    enum: ['Present', 'Half-Day', 'Absent', 'On-Leave'],
    default: 'Present'
  },
  shiftHours: {
    type: Number,
    default: 8,
    min: 0,
    max: 24
  },
  overtimeHours: {
    type: Number,
    default: 0,
    min: 0,
    max: 12
  },
  supervisor: {
    type: String,
    default: 'Head Nurse / Duty Admin'
  },
  remarks: {
    type: String,
    default: ''
  }
}, {
  timestamps: true
});

attendanceSchema.index({ date: 1, empId: 1 }, { unique: true });

module.exports = mongoose.model('Attendance', attendanceSchema);

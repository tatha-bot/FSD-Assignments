const mongoose = require('mongoose');

const employeeSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: [true, 'First name is required'],
      trim: true
    },
    lastName: {
      type: String,
      required: [true, 'Last name is required'],
      trim: true
    },
    email: {
      type: String,
      required: [true, 'Email address is required'],
      unique: true,
      lowercase: true,
      trim: true
    },
    phone: {
      type: String,
      default: '',
      trim: true
    },
    department: {
      type: String,
      required: [true, 'Department is required'],
      enum: ['Engineering', 'Human Resources', 'Marketing', 'Finance', 'Design', 'Sales', 'Operations', 'Other'],
      default: 'Engineering'
    },
    position: {
      type: String,
      required: [true, 'Job position is required'],
      trim: true
    },
    salary: {
      type: Number,
      required: [true, 'Salary is required'],
      min: [0, 'Salary must be positive']
    },
    hireDate: {
      type: Date,
      default: Date.now
    },
    status: {
      type: String,
      enum: ['Active', 'On Leave', 'Terminated'],
      default: 'Active'
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model('Employee', employeeSchema);

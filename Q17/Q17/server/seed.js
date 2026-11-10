const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Employee = require('./models/Employee');
const Attendance = require('./models/Attendance');
const SalaryPayment = require('./models/SalaryPayment');

dotenv.config();

const mongoURI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/hospital_daily_wage';

const seedEmployees = [
  {
    empId: 'HSP-DW-101',
    name: 'Ramesh Kumar',
    role: 'Ward Boy',
    department: 'Emergency & Trauma',
    phone: '+91 98765 43210',
    dailyWageRate: 650,
    overtimeHourlyRate: 120,
    shift: 'Morning (06:00 - 14:00)',
    bankAccount: {
      accountNumber: '918273645012',
      ifscCode: 'SBIN0001234',
      bankName: 'State Bank of India',
      upiId: 'ramesh.ward@upi'
    },
    status: 'Active'
  },
  {
    empId: 'HSP-DW-102',
    name: 'Sunita Devi',
    role: 'Ayah / Caretaker',
    department: 'General Wards',
    phone: '+91 98234 56789',
    dailyWageRate: 600,
    overtimeHourlyRate: 110,
    shift: 'Evening (14:00 - 22:00)',
    bankAccount: {
      accountNumber: '445566778899',
      ifscCode: 'PUNB0123400',
      bankName: 'Punjab National Bank',
      upiId: 'sunita.devi@paytm'
    },
    status: 'Active'
  },
  {
    empId: 'HSP-DW-103',
    name: 'Manoj Paswan',
    role: 'Housekeeping / Sanitation',
    department: 'Housekeeping & Sanitation',
    phone: '+91 97123 45678',
    dailyWageRate: 580,
    overtimeHourlyRate: 100,
    shift: 'Night (22:00 - 06:00)',
    bankAccount: {
      accountNumber: '112233445566',
      ifscCode: 'BARB0HOSPBAN',
      bankName: 'Bank of Baroda',
      upiId: 'manoj.clean@okaxis'
    },
    status: 'Active'
  },
  {
    empId: 'HSP-DW-104',
    name: 'Vikram Singh',
    role: 'Security Guard',
    department: 'Security & Safety',
    phone: '+91 99345 67890',
    dailyWageRate: 700,
    overtimeHourlyRate: 130,
    shift: 'Night (22:00 - 06:00)',
    bankAccount: {
      accountNumber: '334455667788',
      ifscCode: 'HDFC0000456',
      bankName: 'HDFC Bank',
      upiId: 'vikram.guard@okhdfcbank'
    },
    status: 'Active'
  },
  {
    empId: 'HSP-DW-105',
    name: 'Ajay Yadav',
    role: 'Stretcher Bearer',
    department: 'Operation Theatre (OT)',
    phone: '+91 98456 12345',
    dailyWageRate: 620,
    overtimeHourlyRate: 115,
    shift: 'Morning (06:00 - 14:00)',
    bankAccount: {
      accountNumber: '998877665544',
      ifscCode: 'ICIC0000789',
      bankName: 'ICICI Bank',
      upiId: 'ajay.ot@icici'
    },
    status: 'Active'
  },
  {
    empId: 'HSP-DW-106',
    name: 'Kavita Sharma',
    role: 'Dietary / Canteen Staff',
    department: 'Dietary & Nutrition',
    phone: '+91 98112 33445',
    dailyWageRate: 550,
    overtimeHourlyRate: 100,
    shift: 'Morning (06:00 - 14:00)',
    bankAccount: {
      accountNumber: '778899001122',
      ifscCode: 'CNRB0002345',
      bankName: 'Canara Bank',
      upiId: 'kavita.canteen@upi'
    },
    status: 'Active'
  },
  {
    empId: 'HSP-DW-107',
    name: 'Gopal Mondal',
    role: 'Maintenance / Electrician',
    department: 'Maintenance & Facilities',
    phone: '+91 97456 78901',
    dailyWageRate: 750,
    overtimeHourlyRate: 140,
    shift: 'General (09:00 - 17:00)',
    bankAccount: {
      accountNumber: '556677889900',
      ifscCode: 'UBIN0532101',
      bankName: 'Union Bank of India',
      upiId: 'gopal.tech@paytm'
    },
    status: 'Active'
  }
];

async function seed() {
  try {
    await mongoose.connect(mongoURI);
    console.log('Connected to MongoDB for seeding...');

    await Employee.deleteMany({});
    await Attendance.deleteMany({});
    await SalaryPayment.deleteMany({});

    const insertedEmps = await Employee.insertMany(seedEmployees);
    console.log(`Seeded ${insertedEmps.length} daily wage employees.`);

    const todayStr = new Date().toISOString().slice(0, 10);
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayStr = yesterday.toISOString().slice(0, 10);

    // Seed Attendance
    await Attendance.create({
      date: todayStr,
      employeeId: insertedEmps[0]._id,
      empId: insertedEmps[0].empId,
      employeeName: insertedEmps[0].name,
      department: insertedEmps[0].department,
      status: 'Present',
      shiftHours: 8,
      overtimeHours: 2,
      supervisor: 'Sister Mary (Emergency In-Charge)',
      remarks: 'Assisted in trauma unit'
    });

    await Attendance.create({
      date: todayStr,
      employeeId: insertedEmps[1]._id,
      empId: insertedEmps[1].empId,
      employeeName: insertedEmps[1].name,
      department: insertedEmps[1].department,
      status: 'Present',
      shiftHours: 8,
      overtimeHours: 0,
      supervisor: 'Sister Anjali',
      remarks: 'Ward 3 full shift'
    });

    // Seed a salary payment
    await SalaryPayment.create({
      paymentId: 'HSP-PAY-2026-001',
      employeeId: insertedEmps[0]._id,
      empId: insertedEmps[0].empId,
      employeeName: insertedEmps[0].name,
      role: insertedEmps[0].role,
      department: insertedEmps[0].department,
      periodType: 'Daily',
      startDate: yesterdayStr,
      endDate: yesterdayStr,
      dailyWageRate: 650,
      overtimeHourlyRate: 120,
      daysPresent: 1,
      halfDays: 0,
      daysAbsent: 0,
      totalOvertimeHours: 1,
      baseWage: 650,
      overtimeWage: 120,
      hospitalAllowance: 50,
      deductions: 0,
      netPayable: 820,
      paymentMethod: 'Hospital Cash Counter',
      paymentStatus: 'Paid',
      transactionReference: 'TXN-CASH-782190',
      disbursedAt: yesterday,
      disbursedBy: 'Hospital Cashier (Shri R. Sharma)',
      notes: 'Initial seed payment voucher'
    });

    console.log('MongoDB Seed complete!');
    process.exit(0);
  } catch (err) {
    console.error('Seeding error:', err);
    process.exit(1);
  }
}

seed();

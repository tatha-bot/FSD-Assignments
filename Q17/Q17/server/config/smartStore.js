const fs = require('fs');
const path = require('path');
const mongoose = require('mongoose');
const Employee = require('../models/Employee');
const Attendance = require('../models/Attendance');
const SalaryPayment = require('../models/SalaryPayment');

const DATA_FILE = path.join(__dirname, '../data/hospital_db.json');

// Initial seed template for standalone JSON store
const defaultData = {
  employees: [
    {
      _id: 'emp-001',
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
      status: 'Active',
      joinedDate: new Date('2025-01-15').toISOString(),
      createdAt: new Date('2025-01-15').toISOString(),
      updatedAt: new Date().toISOString()
    },
    {
      _id: 'emp-002',
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
      status: 'Active',
      joinedDate: new Date('2025-02-10').toISOString(),
      createdAt: new Date('2025-02-10').toISOString(),
      updatedAt: new Date().toISOString()
    },
    {
      _id: 'emp-003',
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
      status: 'Active',
      joinedDate: new Date('2025-03-01').toISOString(),
      createdAt: new Date('2025-03-01').toISOString(),
      updatedAt: new Date().toISOString()
    },
    {
      _id: 'emp-004',
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
      status: 'Active',
      joinedDate: new Date('2025-01-05').toISOString(),
      createdAt: new Date('2025-01-05').toISOString(),
      updatedAt: new Date().toISOString()
    },
    {
      _id: 'emp-005',
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
      status: 'Active',
      joinedDate: new Date('2025-02-20').toISOString(),
      createdAt: new Date('2025-02-20').toISOString(),
      updatedAt: new Date().toISOString()
    },
    {
      _id: 'emp-006',
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
      status: 'Active',
      joinedDate: new Date('2025-03-12').toISOString(),
      createdAt: new Date('2025-03-12').toISOString(),
      updatedAt: new Date().toISOString()
    },
    {
      _id: 'emp-007',
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
      status: 'Active',
      joinedDate: new Date('2025-01-28').toISOString(),
      createdAt: new Date('2025-01-28').toISOString(),
      updatedAt: new Date().toISOString()
    }
  ],
  attendance: [],
  payments: []
};

// Populate recent attendance & payments for default data
const todayStr = new Date().toISOString().slice(0, 10);
const yesterday = new Date();
yesterday.setDate(yesterday.getDate() - 1);
const yesterdayStr = yesterday.toISOString().slice(0, 10);

defaultData.attendance = [
  {
    _id: 'att-001',
    date: todayStr,
    employeeId: 'emp-001',
    empId: 'HSP-DW-101',
    employeeName: 'Ramesh Kumar',
    department: 'Emergency & Trauma',
    status: 'Present',
    shiftHours: 8,
    overtimeHours: 2,
    supervisor: 'Sister Mary (Emergency In-Charge)',
    remarks: 'ICU patient transfer assist',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    _id: 'att-002',
    date: todayStr,
    employeeId: 'emp-002',
    empId: 'HSP-DW-102',
    employeeName: 'Sunita Devi',
    department: 'General Wards',
    status: 'Present',
    shiftHours: 8,
    overtimeHours: 0,
    supervisor: 'Sister Anjali',
    remarks: 'Full duty in Female Ward 3',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    _id: 'att-003',
    date: todayStr,
    employeeId: 'emp-003',
    empId: 'HSP-DW-103',
    employeeName: 'Manoj Paswan',
    department: 'Housekeeping & Sanitation',
    status: 'Half-Day',
    shiftHours: 4,
    overtimeHours: 0,
    supervisor: 'Sanitation Officer Sen',
    remarks: 'Leave requested for afternoon',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    _id: 'att-004',
    date: todayStr,
    employeeId: 'emp-004',
    empId: 'HSP-DW-104',
    employeeName: 'Vikram Singh',
    department: 'Security & Safety',
    status: 'Present',
    shiftHours: 8,
    overtimeHours: 3,
    supervisor: 'Chief Security Officer Rao',
    remarks: 'VIP convoy arrival extra duty',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    _id: 'att-005',
    date: todayStr,
    employeeId: 'emp-005',
    empId: 'HSP-DW-105',
    employeeName: 'Ajay Yadav',
    department: 'Operation Theatre (OT)',
    status: 'Present',
    shiftHours: 8,
    overtimeHours: 1,
    supervisor: 'Dr. Banerjee (OT Supv)',
    remarks: 'Emergency surgery assist',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    _id: 'att-006',
    date: yesterdayStr,
    employeeId: 'emp-001',
    empId: 'HSP-DW-101',
    employeeName: 'Ramesh Kumar',
    department: 'Emergency & Trauma',
    status: 'Present',
    shiftHours: 8,
    overtimeHours: 1,
    supervisor: 'Sister Mary',
    remarks: 'Routine shifts completed',
    createdAt: yesterday.toISOString(),
    updatedAt: yesterday.toISOString()
  },
  {
    _id: 'att-007',
    date: yesterdayStr,
    employeeId: 'emp-002',
    empId: 'HSP-DW-102',
    employeeName: 'Sunita Devi',
    department: 'General Wards',
    status: 'Present',
    shiftHours: 8,
    overtimeHours: 0,
    supervisor: 'Sister Anjali',
    remarks: 'Normal shift',
    createdAt: yesterday.toISOString(),
    updatedAt: yesterday.toISOString()
  }
];

defaultData.payments = [
  {
    _id: 'pay-001',
    paymentId: 'HSP-PAY-2026-001',
    employeeId: 'emp-001',
    empId: 'HSP-DW-101',
    employeeName: 'Ramesh Kumar',
    role: 'Ward Boy',
    department: 'Emergency & Trauma',
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
    disbursedAt: yesterday.toISOString(),
    disbursedBy: 'Hospital Cashier (Shri R. Sharma)',
    notes: 'Paid daily wage + emergency shift allowance',
    createdAt: yesterday.toISOString(),
    updatedAt: yesterday.toISOString()
  }
];

function initJsonFile() {
  if (!fs.existsSync(DATA_FILE)) {
    fs.mkdirSync(path.dirname(DATA_FILE), { recursive: true });
    fs.writeFileSync(DATA_FILE, JSON.stringify(defaultData, null, 2), 'utf-8');
  }
}

function readJson() {
  initJsonFile();
  try {
    const raw = fs.readFileSync(DATA_FILE, 'utf-8');
    return JSON.parse(raw);
  } catch (err) {
    console.error('Error reading JSON DB:', err);
    return defaultData;
  }
}

function writeJson(data) {
  try {
    fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2), 'utf-8');
  } catch (err) {
    console.error('Error writing JSON DB:', err);
  }
}

function isMongoConnected() {
  return mongoose.connection.readyState === 1;
}

const SmartStore = {
  isMongoConnected,

  async getEmployees(filter = {}) {
    if (isMongoConnected()) {
      const q = {};
      if (filter.q) {
        q.$or = [
          { name: { $regex: filter.q, $options: 'i' } },
          { empId: { $regex: filter.q, $options: 'i' } },
          { role: { $regex: filter.q, $options: 'i' } },
          { department: { $regex: filter.q, $options: 'i' } }
        ];
      }
      if (filter.department && filter.department !== 'All') {
        q.department = filter.department;
      }
      if (filter.status && filter.status !== 'All') {
        q.status = filter.status;
      }
      return await Employee.find(q).sort({ empId: 1 });
    }

    const data = readJson();
    let list = data.employees || [];
    if (filter.q) {
      const term = filter.q.toLowerCase();
      list = list.filter(e =>
        e.name.toLowerCase().includes(term) ||
        e.empId.toLowerCase().includes(term) ||
        e.role.toLowerCase().includes(term) ||
        e.department.toLowerCase().includes(term)
      );
    }
    if (filter.department && filter.department !== 'All') {
      list = list.filter(e => e.department === filter.department);
    }
    if (filter.status && filter.status !== 'All') {
      list = list.filter(e => e.status === filter.status);
    }
    return list;
  },

  async getEmployeeById(id) {
    if (isMongoConnected()) {
      return await Employee.findById(id) || await Employee.findOne({ empId: id });
    }
    const data = readJson();
    return data.employees.find(e => e._id === id || e.empId === id) || null;
  },

  async createEmployee(payload) {
    if (isMongoConnected()) {
      const emp = new Employee(payload);
      return await emp.save();
    }
    const data = readJson();
    const existing = data.employees.find(e => e.empId === payload.empId);
    if (existing) {
      throw new Error(`Employee ID ${payload.empId} already exists`);
    }
    const newEmp = {
      _id: 'emp-' + Date.now(),
      ...payload,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    data.employees.push(newEmp);
    writeJson(data);
    return newEmp;
  },

  async updateEmployee(id, payload) {
    if (isMongoConnected()) {
      return await Employee.findByIdAndUpdate(id, payload, { new: true, runValidators: true });
    }
    const data = readJson();
    const idx = data.employees.findIndex(e => e._id === id || e.empId === id);
    if (idx === -1) return null;
    data.employees[idx] = {
      ...data.employees[idx],
      ...payload,
      updatedAt: new Date().toISOString()
    };
    writeJson(data);
    return data.employees[idx];
  },

  async deleteEmployee(id) {
    if (isMongoConnected()) {
      return await Employee.findByIdAndDelete(id);
    }
    const data = readJson();
    const idx = data.employees.findIndex(e => e._id === id || e.empId === id);
    if (idx === -1) return null;
    const removed = data.employees.splice(idx, 1)[0];
    writeJson(data);
    return removed;
  },

  async getAttendance(filter = {}) {
    if (isMongoConnected()) {
      const q = {};
      if (filter.date) q.date = filter.date;
      if (filter.empId) q.empId = filter.empId;
      if (filter.department && filter.department !== 'All') q.department = filter.department;
      return await Attendance.find(q).sort({ date: -1, empId: 1 });
    }
    const data = readJson();
    let list = data.attendance || [];
    if (filter.date) list = list.filter(a => a.date === filter.date);
    if (filter.empId) list = list.filter(a => a.empId === filter.empId);
    if (filter.department && filter.department !== 'All') {
      list = list.filter(a => a.department === filter.department);
    }
    return list.sort((a, b) => b.date.localeCompare(a.date));
  },

  async markAttendance(record) {
    if (isMongoConnected()) {
      return await Attendance.findOneAndUpdate(
        { date: record.date, empId: record.empId },
        { ...record },
        { upsert: true, new: true, runValidators: true }
      );
    }
    const data = readJson();
    const idx = data.attendance.findIndex(a => a.date === record.date && a.empId === record.empId);
    const updated = {
      _id: idx !== -1 ? data.attendance[idx]._id : 'att-' + Date.now() + Math.floor(Math.random()*100),
      ...record,
      updatedAt: new Date().toISOString(),
      createdAt: idx !== -1 ? data.attendance[idx].createdAt : new Date().toISOString()
    };
    if (idx !== -1) {
      data.attendance[idx] = updated;
    } else {
      data.attendance.push(updated);
    }
    writeJson(data);
    return updated;
  },

  async bulkMarkAttendance(records) {
    const results = [];
    for (const r of records) {
      const res = await this.markAttendance(r);
      results.push(res);
    }
    return results;
  },

  async getPayments(filter = {}) {
    if (isMongoConnected()) {
      const q = {};
      if (filter.empId) q.empId = filter.empId;
      if (filter.paymentStatus && filter.paymentStatus !== 'All') q.paymentStatus = filter.paymentStatus;
      if (filter.department && filter.department !== 'All') q.department = filter.department;
      if (filter.startDate && filter.endDate) {
        q.startDate = { $gte: filter.startDate };
        q.endDate = { $lte: filter.endDate };
      }
      return await SalaryPayment.find(q).sort({ disbursedAt: -1, createdAt: -1 });
    }
    const data = readJson();
    let list = data.payments || [];
    if (filter.empId) list = list.filter(p => p.empId === filter.empId);
    if (filter.paymentStatus && filter.paymentStatus !== 'All') list = list.filter(p => p.paymentStatus === filter.paymentStatus);
    if (filter.department && filter.department !== 'All') list = list.filter(p => p.department === filter.department);
    return list.sort((a, b) => new Date(b.disbursedAt || b.createdAt) - new Date(a.disbursedAt || a.createdAt));
  },

  async getPaymentById(id) {
    if (isMongoConnected()) {
      return await SalaryPayment.findById(id) || await SalaryPayment.findOne({ paymentId: id });
    }
    const data = readJson();
    return data.payments.find(p => p._id === id || p.paymentId === id) || null;
  },

  async createPayment(payload) {
    if (isMongoConnected()) {
      const pay = new SalaryPayment(payload);
      return await pay.save();
    }
    const data = readJson();
    const newPayment = {
      _id: 'pay-' + Date.now(),
      ...payload,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    data.payments.push(newPayment);
    writeJson(data);
    return newPayment;
  },

  async getStats() {
    const employees = await this.getEmployees();
    const today = new Date().toISOString().slice(0, 10);
    const todayAttendance = await this.getAttendance({ date: today });
    const allPayments = await this.getPayments();

    const activeEmployees = employees.filter(e => e.status === 'Active');
    const todayPresent = todayAttendance.filter(a => a.status === 'Present').length;
    const todayHalfDay = todayAttendance.filter(a => a.status === 'Half-Day').length;
    const todayAbsent = todayAttendance.filter(a => a.status === 'Absent').length;

    // Calculate today's estimated wage liability
    let todayLiability = 0;
    todayAttendance.forEach(a => {
      const emp = employees.find(e => e.empId === a.empId);
      if (emp) {
        if (a.status === 'Present') {
          todayLiability += emp.dailyWageRate + (a.overtimeHours * (emp.overtimeHourlyRate || 0));
        } else if (a.status === 'Half-Day') {
          todayLiability += (emp.dailyWageRate / 2) + (a.overtimeHours * (emp.overtimeHourlyRate || 0));
        }
      }
    });

    // Total disbursed
    const totalPaidAmount = allPayments
      .filter(p => p.paymentStatus === 'Paid')
      .reduce((sum, p) => sum + (p.netPayable || 0), 0);

    const pendingPaymentsCount = allPayments.filter(p => p.paymentStatus === 'Pending').length;

    // Department breakdown
    const departmentDistribution = {};
    employees.forEach(e => {
      departmentDistribution[e.department] = (departmentDistribution[e.department] || 0) + 1;
    });

    return {
      totalEmployees: employees.length,
      activeEmployees: activeEmployees.length,
      todayDate: today,
      todayAttendance: {
        totalLogged: todayAttendance.length,
        present: todayPresent,
        halfDay: todayHalfDay,
        absent: todayAbsent
      },
      todayWageLiability: todayLiability,
      totalDisbursedAmount: totalPaidAmount,
      totalPaymentsProcessed: allPayments.length,
      pendingPaymentsCount,
      departmentDistribution,
      dbMode: isMongoConnected() ? 'MongoDB (Live)' : 'Persistent SmartStore (Fallback/File JSON)'
    };
  }
};

module.exports = SmartStore;

const express = require('express');
const router = express.Router();
const SmartStore = require('../config/smartStore');

// GET attendance records
router.get('/', async (req, res) => {
  try {
    const { date, empId, department } = req.query;
    const records = await SmartStore.getAttendance({ date, empId, department });
    res.json(records);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST mark individual employee attendance
router.post('/', async (req, res) => {
  try {
    const { date, empId, status, shiftHours, overtimeHours, supervisor, remarks } = req.body;
    if (!date || !empId || !status) {
      return res.status(400).json({ error: 'Date, Employee ID, and Attendance Status are required' });
    }

    const employee = await SmartStore.getEmployeeById(empId);
    if (!employee) {
      return res.status(404).json({ error: `Employee ${empId} not found` });
    }

    const hours = status === 'Present' ? (Number(shiftHours) || 8) : status === 'Half-Day' ? 4 : 0;

    const record = {
      date,
      employeeId: employee._id,
      empId: employee.empId,
      employeeName: employee.name,
      department: employee.department,
      status,
      shiftHours: hours,
      overtimeHours: Number(overtimeHours) || 0,
      supervisor: supervisor || 'Hospital Duty In-Charge',
      remarks: remarks || ''
    };

    const saved = await SmartStore.markAttendance(record);
    res.status(200).json(saved);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// POST bulk mark attendance for a date (e.g. daily roll-call)
router.post('/bulk', async (req, res) => {
  try {
    const { date, records, supervisor } = req.body;
    if (!date || !Array.isArray(records)) {
      return res.status(400).json({ error: 'Date and records array are required' });
    }

    const employees = await SmartStore.getEmployees();
    const empMap = new Map();
    employees.forEach(e => {
      empMap.set(e.empId, e);
      empMap.set(e._id.toString(), e);
    });

    const attendanceToSave = [];
    for (const r of records) {
      const emp = empMap.get(r.empId) || empMap.get(r.employeeId);
      if (!emp) continue;

      const status = r.status || 'Present';
      const hours = status === 'Present' ? (Number(r.shiftHours) || 8) : status === 'Half-Day' ? 4 : 0;

      attendanceToSave.push({
        date,
        employeeId: emp._id,
        empId: emp.empId,
        employeeName: emp.name,
        department: emp.department,
        status,
        shiftHours: hours,
        overtimeHours: Number(r.overtimeHours) || 0,
        supervisor: supervisor || r.supervisor || 'Head Nurse / Duty Admin',
        remarks: r.remarks || ''
      });
    }

    const saved = await SmartStore.bulkMarkAttendance(attendanceToSave);
    res.json({ message: `Successfully marked attendance for ${saved.length} employees`, records: saved });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;

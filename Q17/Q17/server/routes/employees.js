const express = require('express');
const router = express.Router();
const SmartStore = require('../config/smartStore');

// GET all daily wage employees
router.get('/', async (req, res) => {
  try {
    const { q, department, status } = req.query;
    const employees = await SmartStore.getEmployees({ q, department, status });
    res.json(employees);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET single employee by ID
router.get('/:id', async (req, res) => {
  try {
    const employee = await SmartStore.getEmployeeById(req.params.id);
    if (!employee) {
      return res.status(404).json({ error: 'Employee not found' });
    }
    res.json(employee);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST add new daily wage employee
router.post('/', async (req, res) => {
  try {
    const { name, role, department, phone, dailyWageRate, overtimeHourlyRate, shift, bankAccount } = req.body;
    
    if (!name || !role || !department || !dailyWageRate) {
      return res.status(400).json({ error: 'Name, Role, Department, and Daily Wage Rate are required' });
    }

    // Auto-generate empId if not provided
    let empId = req.body.empId;
    if (!empId) {
      const all = await SmartStore.getEmployees();
      const nextNum = 101 + all.length;
      empId = `HSP-DW-${nextNum}`;
    }

    const payload = {
      empId,
      name,
      role,
      department,
      phone: phone || '',
      dailyWageRate: Number(dailyWageRate),
      overtimeHourlyRate: Number(overtimeHourlyRate) || Math.round(Number(dailyWageRate) / 8 * 1.5),
      shift: shift || 'General (09:00 - 17:00)',
      bankAccount: bankAccount || {},
      status: req.body.status || 'Active',
      joinedDate: req.body.joinedDate || new Date().toISOString()
    };

    const created = await SmartStore.createEmployee(payload);
    res.status(201).json(created);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// PUT update employee details
router.put('/:id', async (req, res) => {
  try {
    const updated = await SmartStore.updateEmployee(req.params.id, req.body);
    if (!updated) {
      return res.status(404).json({ error: 'Employee not found' });
    }
    res.json(updated);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// DELETE employee
router.delete('/:id', async (req, res) => {
  try {
    const deleted = await SmartStore.deleteEmployee(req.params.id);
    if (!deleted) {
      return res.status(404).json({ error: 'Employee not found' });
    }
    res.json({ message: 'Employee deleted successfully', employee: deleted });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;

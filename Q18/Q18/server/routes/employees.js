const express = require('express');
const Employee = require('../models/Employee');
const { getStatus } = require('../config/db');
const memoryStore = require('../data/memoryStore');
const seedEmployees = require('../data/seedEmployees');
const router = express.Router();

// GET /api/employees/stats - Get metrics
router.get('/stats', async (req, res) => {
  try {
    if (!getStatus()) {
      return res.json({ success: true, data: memoryStore.getStats() });
    }

    const employees = await Employee.find({});
    const total = employees.length;
    const sumSalary = employees.reduce((sum, e) => sum + (e.salary || 0), 0);
    const avgSalary = total ? Math.round(sumSalary / total) : 0;
    const activeCount = employees.filter(e => e.status === 'Active').length;

    const departmentBreakdown = {};
    employees.forEach(e => {
      departmentBreakdown[e.department] = (departmentBreakdown[e.department] || 0) + 1;
    });

    res.json({
      success: true,
      data: { total, avgSalary, activeCount, departmentBreakdown }
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// POST /api/employees/seed - Reset demo data
router.post('/seed', async (req, res) => {
  try {
    if (!getStatus()) {
      const reset = memoryStore.resetDemo();
      return res.json({ success: true, message: 'Demo data reset successfully!', count: reset.length, data: reset });
    }

    await Employee.deleteMany({});
    const created = await Employee.insertMany(seedEmployees);
    res.json({ success: true, message: 'Demo data seeded into MongoDB!', count: created.length, data: created });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// GET /api/employees - Search & list employees
router.get('/', async (req, res) => {
  const { q, department, sort } = req.query;

  try {
    if (!getStatus()) {
      const employees = memoryStore.getEmployees({ q, department, sort });
      return res.json({ success: true, count: employees.length, data: employees, source: 'memory-store' });
    }

    let filter = {};
    if (q) {
      filter.$or = [
        { firstName: { $regex: q, $options: 'i' } },
        { lastName: { $regex: q, $options: 'i' } },
        { email: { $regex: q, $options: 'i' } },
        { department: { $regex: q, $options: 'i' } },
        { position: { $regex: q, $options: 'i' } }
      ];
    }
    if (department && department !== 'All') {
      filter.department = department;
    }

    let sortOption = { createdAt: -1 };
    if (sort === 'salary_desc') sortOption = { salary: -1 };
    else if (sort === 'salary_asc') sortOption = { salary: 1 };
    else if (sort === 'name_asc') sortOption = { firstName: 1 };
    else if (sort === 'name_desc') sortOption = { firstName: -1 };

    const employees = await Employee.find(filter).sort(sortOption);
    res.json({ success: true, count: employees.length, data: employees, source: 'mongodb' });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// GET /api/employees/:id - Get single employee
router.get('/:id', async (req, res) => {
  try {
    if (!getStatus()) {
      const emp = memoryStore.getEmployeeById(req.params.id);
      if (!emp) return res.status(404).json({ success: false, error: 'Employee not found' });
      return res.json({ success: true, data: emp });
    }

    const employee = await Employee.findById(req.params.id);
    if (!employee) return res.status(404).json({ success: false, error: 'Employee not found' });
    res.json({ success: true, data: employee });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// POST /api/employees - Create new employee
router.post('/', async (req, res) => {
  try {
    const { firstName, lastName, email, department, position, salary } = req.body;
    if (!firstName || !lastName || !email || !department || !position || salary === undefined) {
      return res.status(400).json({
        success: false,
        error: 'Please fill in all required fields (firstName, lastName, email, department, position, salary)'
      });
    }

    if (!getStatus()) {
      const newEmp = memoryStore.createEmployee(req.body);
      return res.status(201).json({ success: true, message: 'Employee added successfully', data: newEmp });
    }

    const employee = new Employee(req.body);
    await employee.save();
    res.status(201).json({ success: true, message: 'Employee added successfully', data: employee });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
});

// PUT /api/employees/:id - Update employee
router.put('/:id', async (req, res) => {
  try {
    if (!getStatus()) {
      const updated = memoryStore.updateEmployee(req.params.id, req.body);
      if (!updated) return res.status(404).json({ success: false, error: 'Employee not found' });
      return res.json({ success: true, message: 'Employee updated successfully', data: updated });
    }

    const employee = await Employee.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });
    if (!employee) return res.status(404).json({ success: false, error: 'Employee not found' });
    res.json({ success: true, message: 'Employee updated successfully', data: employee });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
});

// DELETE /api/employees/:id - Delete employee
router.delete('/:id', async (req, res) => {
  try {
    if (!getStatus()) {
      const deleted = memoryStore.deleteEmployee(req.params.id);
      if (!deleted) return res.status(404).json({ success: false, error: 'Employee not found' });
      return res.json({ success: true, message: 'Employee deleted successfully' });
    }

    const employee = await Employee.findByIdAndDelete(req.params.id);
    if (!employee) return res.status(404).json({ success: false, error: 'Employee not found' });
    res.json({ success: true, message: 'Employee deleted successfully' });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

module.exports = router;

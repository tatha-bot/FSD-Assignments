const express = require('express');
const router = express.Router();
const SmartStore = require('../config/smartStore');

// Helper to compute wage breakdown from attendance
async function computeWageBreakdown(empId, startDate, endDate, allowance = 0, deductions = 0) {
  const employee = await SmartStore.getEmployeeById(empId);
  if (!employee) {
    throw new Error(`Employee with ID ${empId} not found`);
  }

  // Get attendance logs in date range
  const allAttendance = await SmartStore.getAttendance({ empId: employee.empId });
  const inRange = allAttendance.filter(a => a.date >= startDate && a.date <= endDate);

  let daysPresent = 0;
  let halfDays = 0;
  let daysAbsent = 0;
  let totalOvertimeHours = 0;

  inRange.forEach(a => {
    if (a.status === 'Present') {
      daysPresent += 1;
    } else if (a.status === 'Half-Day') {
      halfDays += 1;
    } else if (a.status === 'Absent') {
      daysAbsent += 1;
    }
    totalOvertimeHours += Number(a.overtimeHours) || 0;
  });

  // If no attendance was logged for today and it's a single day calculation, default to 1 present day if requested
  const isSingleDay = startDate === endDate;
  if (inRange.length === 0 && isSingleDay) {
    daysPresent = 1; // default preview as 1 day
  }

  const dailyWageRate = Number(employee.dailyWageRate) || 0;
  const overtimeHourlyRate = Number(employee.overtimeHourlyRate) || Math.round((dailyWageRate / 8) * 1.5);

  const baseWage = Math.round((daysPresent * dailyWageRate) + (halfDays * (dailyWageRate / 2)));
  const overtimeWage = Math.round(totalOvertimeHours * overtimeHourlyRate);
  const totalAllowance = Number(allowance) || 0;
  const totalDeductions = Number(deductions) || 0;
  const netPayable = Math.max(0, baseWage + overtimeWage + totalAllowance - totalDeductions);

  return {
    employee,
    period: { startDate, endDate, isSingleDay },
    attendanceLogs: inRange,
    daysPresent,
    halfDays,
    daysAbsent,
    totalOvertimeHours,
    dailyWageRate,
    overtimeHourlyRate,
    baseWage,
    overtimeWage,
    hospitalAllowance: totalAllowance,
    deductions: totalDeductions,
    netPayable
  };
}

// POST calculate wage preview
router.post('/calculate', async (req, res) => {
  try {
    const { empId, startDate, endDate, allowance, deductions } = req.body;
    if (!empId || !startDate || !endDate) {
      return res.status(400).json({ error: 'empId, startDate, and endDate are required' });
    }

    const breakdown = await computeWageBreakdown(empId, startDate, endDate, allowance, deductions);
    res.json(breakdown);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// POST pay daily wage / disburse salary
router.post('/pay', async (req, res) => {
  try {
    const {
      empId,
      startDate,
      endDate,
      periodType,
      hospitalAllowance,
      deductions,
      paymentMethod,
      disbursedBy,
      notes
    } = req.body;

    if (!empId || !startDate || !endDate) {
      return res.status(400).json({ error: 'empId, startDate, and endDate are required' });
    }

    const breakdown = await computeWageBreakdown(
      empId,
      startDate,
      endDate,
      hospitalAllowance,
      deductions
    );

    const emp = breakdown.employee;
    const year = new Date().getFullYear();
    const randomHex = Math.random().toString(36).substring(2, 7).toUpperCase();
    const paymentId = `HSP-PAY-${year}-${randomHex}`;
    const txnRef = `TXN-${Date.now().toString().slice(-6)}-${Math.floor(1000 + Math.random() * 9000)}`;

    const paymentPayload = {
      paymentId,
      employeeId: emp._id,
      empId: emp.empId,
      employeeName: emp.name,
      role: emp.role,
      department: emp.department,
      periodType: periodType || (startDate === endDate ? 'Daily' : 'Custom Range'),
      startDate,
      endDate,
      dailyWageRate: breakdown.dailyWageRate,
      overtimeHourlyRate: breakdown.overtimeHourlyRate,
      daysPresent: breakdown.daysPresent,
      halfDays: breakdown.halfDays,
      daysAbsent: breakdown.daysAbsent,
      totalOvertimeHours: breakdown.totalOvertimeHours,
      baseWage: breakdown.baseWage,
      overtimeWage: breakdown.overtimeWage,
      hospitalAllowance: breakdown.hospitalAllowance,
      deductions: breakdown.deductions,
      netPayable: breakdown.netPayable,
      paymentMethod: paymentMethod || 'Hospital Cash Counter',
      paymentStatus: 'Paid',
      transactionReference: txnRef,
      disbursedAt: new Date().toISOString(),
      disbursedBy: disbursedBy || 'Hospital Administrative Officer',
      notes: notes || ''
    };

    const paymentRecord = await SmartStore.createPayment(paymentPayload);
    res.status(201).json({
      message: `Wage payment of ₹${breakdown.netPayable} disbursed successfully to ${emp.name}`,
      payment: paymentRecord
    });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// GET all salary payment records
router.get('/payments', async (req, res) => {
  try {
    const { empId, paymentStatus, department, startDate, endDate } = req.query;
    const payments = await SmartStore.getPayments({ empId, paymentStatus, department, startDate, endDate });
    res.json(payments);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET specific payment receipt / slip
router.get('/payments/:id', async (req, res) => {
  try {
    const payment = await SmartStore.getPaymentById(req.params.id);
    if (!payment) {
      return res.status(404).json({ error: 'Payment record not found' });
    }
    res.json(payment);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST batch disburse wages for all workers present on a given date
router.post('/batch-disburse', async (req, res) => {
  try {
    const { date, paymentMethod, disbursedBy } = req.body;
    if (!date) {
      return res.status(400).json({ error: 'Date is required for batch wage disbursal' });
    }

    const attendanceList = await SmartStore.getAttendance({ date });
    const eligibleAttendance = attendanceList.filter(a => a.status === 'Present' || a.status === 'Half-Day');

    if (eligibleAttendance.length === 0) {
      return res.status(400).json({ error: `No active attendance found for date ${date}` });
    }

    const disbursed = [];
    for (const att of eligibleAttendance) {
      const breakdown = await computeWageBreakdown(att.empId, date, date, 0, 0);
      const emp = breakdown.employee;
      const paymentId = `HSP-PAY-${Date.now().toString().slice(-6)}-${att.empId.replace(/[^a-zA-Z0-9]/g, '')}`;
      
      const payload = {
        paymentId,
        employeeId: emp._id,
        empId: emp.empId,
        employeeName: emp.name,
        role: emp.role,
        department: emp.department,
        periodType: 'Daily',
        startDate: date,
        endDate: date,
        dailyWageRate: breakdown.dailyWageRate,
        overtimeHourlyRate: breakdown.overtimeHourlyRate,
        daysPresent: breakdown.daysPresent,
        halfDays: breakdown.halfDays,
        daysAbsent: breakdown.daysAbsent,
        totalOvertimeHours: breakdown.totalOvertimeHours,
        baseWage: breakdown.baseWage,
        overtimeWage: breakdown.overtimeWage,
        hospitalAllowance: 0,
        deductions: 0,
        netPayable: breakdown.netPayable,
        paymentMethod: paymentMethod || 'Hospital Cash Counter',
        paymentStatus: 'Paid',
        transactionReference: `TXN-BATCH-${Math.floor(100000 + Math.random() * 900000)}`,
        disbursedAt: new Date().toISOString(),
        disbursedBy: disbursedBy || 'Hospital Administrative Officer',
        notes: `Batch daily wage auto-disbursed for ${date}`
      };

      const record = await SmartStore.createPayment(payload);
      disbursed.push(record);
    }

    const totalAmount = disbursed.reduce((sum, d) => sum + d.netPayable, 0);
    res.json({
      message: `Batch disbursal successful for ${disbursed.length} daily wage workers. Total paid: ₹${totalAmount}`,
      count: disbursed.length,
      totalAmount,
      payments: disbursed
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;

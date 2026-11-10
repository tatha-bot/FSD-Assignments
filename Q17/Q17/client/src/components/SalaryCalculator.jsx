import React, { useState, useEffect } from 'react';
import { 
  IndianRupee, 
  Calendar, 
  User, 
  Calculator, 
  CreditCard, 
  CheckCircle2, 
  AlertTriangle,
  Receipt,
  Zap,
  ArrowRight
} from 'lucide-react';
import { api } from '../services/api';

export default function SalaryCalculator({ preselectedEmp, onPaymentCompleted }) {
  const todayStr = new Date().toISOString().slice(0, 10);

  const [employees, setEmployees] = useState([]);
  const [selectedEmpId, setSelectedEmpId] = useState('');
  const [startDate, setStartDate] = useState(todayStr);
  const [endDate, setEndDate] = useState(todayStr);
  const [periodType, setPeriodType] = useState('Daily'); // 'Daily', 'Weekly', 'Custom Range'
  const [allowance, setAllowance] = useState(0);
  const [deductions, setDeductions] = useState(0);
  const [paymentMethod, setPaymentMethod] = useState('Hospital Cash Counter');
  const [disbursedBy, setDisbursedBy] = useState('Hospital Payroll Officer (Accounts)');
  const [notes, setNotes] = useState('');

  const [calculation, setCalculation] = useState(null);
  const [calculating, setCalculating] = useState(false);
  const [processingPayment, setProcessingPayment] = useState(false);
  const [activeTabMode, setActiveTabMode] = useState('individual'); // 'individual' or 'batch'

  // Batch states
  const [batchDate, setBatchDate] = useState(todayStr);
  const [batchMethod, setBatchMethod] = useState('Hospital Cash Counter');
  const [batchProcessing, setBatchProcessing] = useState(false);
  const [batchResult, setBatchResult] = useState(null);

  // Load employees
  useEffect(() => {
    async function fetchEmps() {
      try {
        const emps = await api.getEmployees({ status: 'Active' });
        setEmployees(emps);
        if (preselectedEmp) {
          setSelectedEmpId(preselectedEmp.empId);
        } else if (emps.length > 0 && !selectedEmpId) {
          setSelectedEmpId(emps[0].empId);
        }
      } catch (err) {
        console.error('Error fetching employees:', err);
      }
    }
    fetchEmps();
  }, [preselectedEmp]);

  // Adjust dates based on period type
  const handlePeriodChange = (type) => {
    setPeriodType(type);
    if (type === 'Daily') {
      setStartDate(todayStr);
      setEndDate(todayStr);
    } else if (type === 'Weekly') {
      const pastWeek = new Date();
      pastWeek.setDate(pastWeek.getDate() - 6);
      setStartDate(pastWeek.toISOString().slice(0, 10));
      setEndDate(todayStr);
    }
  };

  // Run calculation preview
  const runCalculation = async () => {
    if (!selectedEmpId) return;
    try {
      setCalculating(true);
      const res = await api.calculateWage({
        empId: selectedEmpId,
        startDate,
        endDate,
        allowance: Number(allowance) || 0,
        deductions: Number(deductions) || 0
      });
      setCalculation(res);
    } catch (err) {
      console.error('Calculation failed:', err);
    } finally {
      setCalculating(false);
    }
  };

  useEffect(() => {
    if (selectedEmpId) {
      runCalculation();
    }
  }, [selectedEmpId, startDate, endDate, allowance, deductions]);

  const selectedEmployee = employees.find(e => e.empId === selectedEmpId);

  // Submit payment
  const handleDisbursePayment = async (e) => {
    e.preventDefault();
    if (!calculation || !selectedEmployee) return;

    try {
      setProcessingPayment(true);
      const response = await api.disburseSalary({
        empId: selectedEmpId,
        startDate,
        endDate,
        periodType,
        hospitalAllowance: Number(allowance) || 0,
        deductions: Number(deductions) || 0,
        paymentMethod,
        disbursedBy,
        notes: notes || `Hospital daily wage disbursal for ${periodType} period`
      });

      alert(`✅ Payment Successful!\n\nTransaction ID: ${response.payment.transactionReference}\nAmount: ₹${response.payment.netPayable} paid to ${response.payment.employeeName}`);

      if (onPaymentCompleted) {
        onPaymentCompleted(response.payment);
      }
    } catch (err) {
      alert('Payment processing failed: ' + err.message);
    } finally {
      setProcessingPayment(false);
    }
  };

  // Submit batch disbursal
  const handleBatchDisburse = async (e) => {
    e.preventDefault();
    if (!window.confirm(`Disburse daily wages for all attended employees on ${batchDate} via ${batchMethod}?`)) {
      return;
    }

    try {
      setBatchProcessing(true);
      const res = await api.batchDisburseSalary({
        date: batchDate,
        paymentMethod: batchMethod,
        disbursedBy: 'Hospital Chief Payroll Officer'
      });
      setBatchResult(res);
      alert(`✅ ${res.message}`);
      if (onPaymentCompleted) {
        onPaymentCompleted(res.payments[0] || null);
      }
    } catch (err) {
      alert('Batch Disbursal Error: ' + err.message);
    } finally {
      setBatchProcessing(false);
    }
  };

  return (
    <div className="salary-view">
      <div className="section-header">
        <div>
          <h2 className="section-title">Hospital Daily Wage Calculation & Disbursal</h2>
          <p className="section-subtitle">
            Compute daily shifts, hospital allowances, overtime hours, and disburse instant wage payments
          </p>
        </div>

        {/* Tab switcher */}
        <div style={{ display: 'flex', background: '#e2e8f0', padding: '0.25rem', borderRadius: '8px' }}>
          <button
            className={`btn btn-sm ${activeTabMode === 'individual' ? 'btn-primary' : 'btn-outline'}`}
            style={{ border: 'none' }}
            onClick={() => setActiveTabMode('individual')}
          >
            Individual Staff Payout
          </button>
          <button
            className={`btn btn-sm ${activeTabMode === 'batch' ? 'btn-primary' : 'btn-outline'}`}
            style={{ border: 'none' }}
            onClick={() => setActiveTabMode('batch')}
          >
            <Zap size={14} /> Bulk Daily Disbursal
          </button>
        </div>
      </div>

      {activeTabMode === 'individual' ? (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: '1.5rem' }}>
          {/* Left: Input Parameters Card */}
          <div style={{ background: '#ffffff', border: '1px solid var(--border)', borderRadius: 'var(--radius)', padding: '1.5rem', boxShadow: 'var(--shadow-sm)' }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#0f172a' }}>
              <User size={18} color="var(--primary)" />
              1. Select Worker & Pay Period
            </h3>

            <div className="form-group" style={{ marginBottom: '1rem' }}>
              <label>Select Daily Wage Employee *</label>
              <select
                className="select-ctrl"
                value={selectedEmpId}
                onChange={(e) => setSelectedEmpId(e.target.value)}
              >
                {employees.map(e => (
                  <option key={e.empId} value={e.empId}>
                    {e.empId} - {e.name} ({e.role} &bull; {e.department} &bull; ₹{e.dailyWageRate}/day)
                  </option>
                ))}
              </select>
            </div>

            {selectedEmployee && (
              <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '0.85rem', marginBottom: '1.25rem', fontSize: '0.82rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.3rem' }}>
                  <span style={{ color: 'var(--text-muted)' }}>Role:</span>
                  <strong>{selectedEmployee.role}</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.3rem' }}>
                  <span style={{ color: 'var(--text-muted)' }}>Department:</span>
                  <strong>{selectedEmployee.department}</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.3rem' }}>
                  <span style={{ color: 'var(--text-muted)' }}>Daily Wage Rate:</span>
                  <strong style={{ color: '#059669' }}>₹{selectedEmployee.dailyWageRate} / day</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: 'var(--text-muted)' }}>Overtime Rate:</span>
                  <strong style={{ color: '#0284c7' }}>₹{selectedEmployee.overtimeHourlyRate} / hr</strong>
                </div>
              </div>
            )}

            <div className="form-group" style={{ marginBottom: '1rem' }}>
              <label>Wage Period Type</label>
              <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.25rem' }}>
                {['Daily', 'Weekly', 'Custom Range'].map(t => (
                  <button
                    key={t}
                    type="button"
                    className={`btn btn-sm ${periodType === t ? 'btn-primary' : 'btn-outline'}`}
                    onClick={() => handlePeriodChange(t)}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginBottom: '1rem' }}>
              <div className="form-group">
                <label>From Date</label>
                <input
                  type="date"
                  className="input-ctrl"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                />
              </div>
              <div className="form-group">
                <label>To Date</label>
                <input
                  type="date"
                  className="input-ctrl"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginBottom: '1rem' }}>
              <div className="form-group">
                <label>Hospital Allowance (₹)</label>
                <input
                  type="number"
                  min="0"
                  className="input-ctrl"
                  value={allowance}
                  onChange={(e) => setAllowance(e.target.value)}
                  placeholder="e.g. 50 (Meal/Risk)"
                />
              </div>
              <div className="form-group">
                <label>Deductions (₹)</label>
                <input
                  type="number"
                  min="0"
                  className="input-ctrl"
                  value={deductions}
                  onChange={(e) => setDeductions(e.target.value)}
                  placeholder="e.g. 0 (Advances)"
                />
              </div>
            </div>

            <div className="form-group" style={{ marginBottom: '1rem' }}>
              <label>Payment Channel</label>
              <select
                className="select-ctrl"
                value={paymentMethod}
                onChange={(e) => setPaymentMethod(e.target.value)}
              >
                <option value="Hospital Cash Counter">Hospital Cash Counter (Instant Slip)</option>
                <option value="UPI Instant Pay">UPI Instant Pay ({selectedEmployee?.bankAccount?.upiId || 'Direct UPI'})</option>
                <option value="Bank Transfer (NEFT/IMPS)">Bank Transfer (NEFT/IMPS)</option>
                <option value="Cheque">Official Hospital Cheque</option>
              </select>
            </div>

            <div className="form-group" style={{ marginBottom: '1rem' }}>
              <label>Authorized Payroll Signatory</label>
              <input
                type="text"
                className="input-ctrl"
                value={disbursedBy}
                onChange={(e) => setDisbursedBy(e.target.value)}
              />
            </div>
          </div>

          {/* Right: Real-time Wage Calculation Breakdown Card */}
          <div style={{ background: '#ffffff', border: '1px solid var(--border)', borderRadius: 'var(--radius)', padding: '1.5rem', boxShadow: 'var(--shadow-sm)', display: 'flex', flexDirection: 'column' }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#0f172a' }}>
              <Calculator size={18} color="#059669" />
              2. Wage Statement & Disbursal Preview
            </h3>

            {calculating ? (
              <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)' }}>Computing wage breakdown...</div>
            ) : calculation ? (
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                <div>
                  <div style={{ background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: '8px', padding: '1rem', marginBottom: '1.25rem' }}>
                    <div style={{ fontSize: '0.82rem', color: '#166534', fontWeight: 600 }}>NET PAYABLE SALARY</div>
                    <div style={{ fontSize: '2.4rem', fontWeight: 800, color: '#15803d', fontFamily: 'monospace' }}>
                      ₹{calculation.netPayable.toLocaleString('en-IN')}
                    </div>
                    <div style={{ fontSize: '0.8rem', color: '#166534' }}>
                      Period: {calculation.period.startDate} to {calculation.period.endDate} ({periodType})
                    </div>
                  </div>

                  {/* Itemized Table */}
                  <table style={{ width: '100%', fontSize: '0.88rem', borderCollapse: 'collapse', marginBottom: '1.25rem' }}>
                    <tbody>
                      <tr style={{ borderBottom: '1px solid #f1f5f9' }}>
                        <td style={{ padding: '0.5rem 0', color: 'var(--text-muted)' }}>Daily Rate</td>
                        <td style={{ textAlign: 'right', fontWeight: 600 }}>₹{calculation.dailyWageRate} / day</td>
                      </tr>
                      <tr style={{ borderBottom: '1px solid #f1f5f9' }}>
                        <td style={{ padding: '0.5rem 0', color: 'var(--text-muted)' }}>Days Present on Duty</td>
                        <td style={{ textAlign: 'right', fontWeight: 600 }}>{calculation.daysPresent} day(s)</td>
                      </tr>
                      <tr style={{ borderBottom: '1px solid #f1f5f9' }}>
                        <td style={{ padding: '0.5rem 0', color: 'var(--text-muted)' }}>Half-Day Duties</td>
                        <td style={{ textAlign: 'right', fontWeight: 600 }}>{calculation.halfDays} day(s)</td>
                      </tr>
                      <tr style={{ borderBottom: '1px solid #f1f5f9' }}>
                        <td style={{ padding: '0.5rem 0', color: 'var(--text-muted)' }}>Base Daily Wage Subtotal</td>
                        <td style={{ textAlign: 'right', fontWeight: 700, color: '#0f172a' }}>₹{calculation.baseWage}</td>
                      </tr>
                      <tr style={{ borderBottom: '1px solid #f1f5f9' }}>
                        <td style={{ padding: '0.5rem 0', color: 'var(--text-muted)' }}>Overtime Hours Logged</td>
                        <td style={{ textAlign: 'right', fontWeight: 600 }}>{calculation.totalOvertimeHours} hrs (@ ₹{calculation.overtimeHourlyRate}/hr)</td>
                      </tr>
                      <tr style={{ borderBottom: '1px solid #f1f5f9' }}>
                        <td style={{ padding: '0.5rem 0', color: 'var(--text-muted)' }}>Overtime Wage Subtotal</td>
                        <td style={{ textAlign: 'right', fontWeight: 700, color: '#0369a1' }}>+ ₹{calculation.overtimeWage}</td>
                      </tr>
                      <tr style={{ borderBottom: '1px solid #f1f5f9' }}>
                        <td style={{ padding: '0.5rem 0', color: 'var(--text-muted)' }}>Special Hospital Allowances</td>
                        <td style={{ textAlign: 'right', fontWeight: 700, color: '#059669' }}>+ ₹{calculation.hospitalAllowance}</td>
                      </tr>
                      <tr style={{ borderBottom: '1px solid #f1f5f9' }}>
                        <td style={{ padding: '0.5rem 0', color: 'var(--text-muted)' }}>Statutory Deductions / Advance</td>
                        <td style={{ textAlign: 'right', fontWeight: 700, color: '#dc2626' }}>- ₹{calculation.deductions}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                <div>
                  <button
                    className="btn btn-success"
                    style={{ width: '100%', padding: '0.85rem', fontSize: '1rem', fontWeight: 700 }}
                    onClick={handleDisbursePayment}
                    disabled={processingPayment}
                  >
                    <IndianRupee size={20} />
                    {processingPayment ? 'Processing Payment & Issuing Receipt...' : `Disburse ₹${calculation.netPayable} Now`}
                  </button>
                  <p style={{ textAlign: 'center', fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '0.5rem' }}>
                    Clicking generates a permanent transaction record and official hospital pay receipt.
                  </p>
                </div>
              </div>
            ) : (
              <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)' }}>
                Please select a worker to preview wage breakdown.
              </div>
            )}
          </div>
        </div>
      ) : (
        /* Batch Disbursal Panel */
        <div style={{ background: '#ffffff', border: '1px solid var(--border)', borderRadius: 'var(--radius)', padding: '2rem', maxWidth: '750px', margin: '0 auto', boxShadow: 'var(--shadow-sm)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
            <div style={{ background: '#fef3c7', color: '#d97706', padding: '0.6rem', borderRadius: '10px' }}>
              <Zap size={24} />
            </div>
            <div>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: '#0f172a' }}>Bulk Daily Wage Disbursal</h3>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                One-click payroll settlement for all daily wage workers who were present on duty today
              </p>
            </div>
          </div>

          <form onSubmit={handleBatchDisburse}>
            <div className="form-group" style={{ marginBottom: '1.25rem' }}>
              <label>Select Attendance Date for Wage Settlement *</label>
              <input
                type="date"
                required
                className="input-ctrl"
                value={batchDate}
                onChange={(e) => setBatchDate(e.target.value)}
              />
            </div>

            <div className="form-group" style={{ marginBottom: '1.5rem' }}>
              <label>Disbursal Payment Channel *</label>
              <select
                className="select-ctrl"
                value={batchMethod}
                onChange={(e) => setBatchMethod(e.target.value)}
              >
                <option value="Hospital Cash Counter">Hospital Cash Counter (Cash Disbursal)</option>
                <option value="UPI Instant Pay">UPI Instant Pay (Direct UPI Batch)</option>
                <option value="Bank Transfer (NEFT/IMPS)">Bank Transfer (NEFT Batch)</option>
              </select>
            </div>

            <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '1rem', marginBottom: '1.5rem', fontSize: '0.85rem' }}>
              <div style={{ fontWeight: 600, color: '#334155', marginBottom: '0.35rem' }}>What this automated batch does:</div>
              <ul style={{ paddingLeft: '1.25rem', color: 'var(--text-muted)', lineHeight: '1.6' }}>
                <li>Scans all staff marked <strong>Present</strong> or <strong>Half-Day</strong> on {batchDate}.</li>
                <li>Calculates their respective daily base wage + overtime wage.</li>
                <li>Generates unique payment transaction references (TXN-BATCH-xxxx).</li>
                <li>Logs all entries into the payment history archive.</li>
              </ul>
            </div>

            <button
              type="submit"
              className="btn btn-primary"
              style={{ width: '100%', padding: '0.85rem', fontSize: '1rem', fontWeight: 700 }}
              disabled={batchProcessing}
            >
              <Zap size={18} />
              {batchProcessing ? 'Executing Batch Disbursal...' : `Execute Daily Wage Disbursal for ${batchDate}`}
            </button>
          </form>

          {batchResult && (
            <div style={{ marginTop: '1.5rem', background: '#ecfdf5', border: '1px solid #a7f3d0', padding: '1rem', borderRadius: '8px' }}>
              <div style={{ fontWeight: 700, color: '#065f46', fontSize: '0.95rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <CheckCircle2 size={18} /> {batchResult.message}
              </div>
              <div style={{ fontSize: '0.85rem', color: '#047857', marginTop: '0.25rem' }}>
                {batchResult.count} workers received salary totaling ₹{batchResult.totalAmount.toLocaleString('en-IN')}.
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

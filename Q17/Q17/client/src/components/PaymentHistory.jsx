import React, { useState, useEffect } from 'react';
import { 
  Receipt, 
  Search, 
  Printer, 
  Calendar, 
  CheckCircle2, 
  Clock, 
  FileText,
  IndianRupee,
  Eye
} from 'lucide-react';
import { api } from '../services/api';

export default function PaymentHistory({ onSelectSlipToPrint }) {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedDept, setSelectedDept] = useState('All');

  const loadPayments = async () => {
    try {
      setLoading(true);
      const data = await api.getPayments({
        department: selectedDept !== 'All' ? selectedDept : undefined
      });
      setPayments(data);
    } catch (err) {
      console.error('Error loading payment history:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPayments();
  }, [selectedDept]);

  const filtered = payments.filter(p => {
    if (!search) return true;
    const term = search.toLowerCase();
    return (
      p.employeeName?.toLowerCase().includes(term) ||
      p.empId?.toLowerCase().includes(term) ||
      p.paymentId?.toLowerCase().includes(term) ||
      p.transactionReference?.toLowerCase().includes(term)
    );
  });

  const totalAmount = filtered.reduce((sum, p) => sum + (p.netPayable || 0), 0);

  return (
    <div className="history-view">
      <div className="section-header">
        <div>
          <h2 className="section-title">Hospital Daily Wage Disbursement Register</h2>
          <p className="section-subtitle">
            Complete transaction history, audited payment receipts, and printable salary vouchers
          </p>
        </div>
        <div style={{ background: '#d1fae5', color: '#065f46', padding: '0.45rem 1rem', borderRadius: '8px', fontWeight: 700, fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
          <IndianRupee size={16} /> Total Paid: ₹{totalAmount.toLocaleString('en-IN')}
        </div>
      </div>

      {/* Toolbar */}
      <div className="toolbar">
        <div className="search-input-wrap">
          <Search size={16} color="var(--text-muted)" />
          <input
            type="text"
            placeholder="Search by worker name, Txn Ref, Pay ID..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
          <label style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-muted)' }}>Hospital Department:</label>
          <select
            className="select-ctrl"
            value={selectedDept}
            onChange={(e) => setSelectedDept(e.target.value)}
          >
            <option value="All">All Departments</option>
            <option value="Emergency & Trauma">Emergency & Trauma</option>
            <option value="General Wards">General Wards</option>
            <option value="Housekeeping & Sanitation">Housekeeping & Sanitation</option>
            <option value="Security & Safety">Security & Safety</option>
            <option value="Operation Theatre (OT)">Operation Theatre (OT)</option>
            <option value="Dietary & Nutrition">Dietary & Nutrition</option>
            <option value="Maintenance & Facilities">Maintenance & Facilities</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="table-container">
        {loading ? (
          <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)' }}>Loading payments log...</div>
        ) : filtered.length === 0 ? (
          <div style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-muted)' }}>
            No wage payment records found.
          </div>
        ) : (
          <table className="data-table">
            <thead>
              <tr>
                <th>Payment ID & Date</th>
                <th>Daily Wage Worker</th>
                <th>Department</th>
                <th>Period</th>
                <th>Duty Log</th>
                <th>Base + OT + Allow</th>
                <th>Net Disbursed</th>
                <th>Payment Mode</th>
                <th>Status</th>
                <th style={{ textAlign: 'right' }}>Slip</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(p => (
                <tr key={p._id || p.paymentId}>
                  <td>
                    <div style={{ fontFamily: 'monospace', fontWeight: 700, color: '#0369a1', fontSize: '0.85rem' }}>
                      {p.paymentId}
                    </div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                      {new Date(p.disbursedAt || p.createdAt).toLocaleDateString('en-IN', {
                        day: '2-digit',
                        month: 'short',
                        year: 'numeric'
                      })}
                    </div>
                  </td>
                  <td>
                    <div style={{ fontWeight: 700, color: '#0f172a' }}>{p.employeeName}</div>
                    <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                      {p.empId} &bull; {p.role}
                    </div>
                  </td>
                  <td>
                    <span className="badge badge-dept">{p.department}</span>
                  </td>
                  <td>
                    <div style={{ fontSize: '0.8rem', fontWeight: 600 }}>{p.periodType}</div>
                    <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                      {p.startDate} {p.startDate !== p.endDate && `to ${p.endDate}`}
                    </div>
                  </td>
                  <td>
                    <div style={{ fontSize: '0.8rem' }}>
                      <strong>{p.daysPresent}</strong> Present &bull; <strong>{p.halfDays}</strong> Half
                    </div>
                    {p.totalOvertimeHours > 0 && (
                      <div style={{ fontSize: '0.75rem', color: '#0284c7' }}>
                        +{p.totalOvertimeHours} hrs OT
                      </div>
                    )}
                  </td>
                  <td style={{ fontSize: '0.8rem' }}>
                    <div>Base: ₹{p.baseWage}</div>
                    <div style={{ color: 'var(--text-muted)', fontSize: '0.72rem' }}>
                      OT: ₹{p.overtimeWage} | All: ₹{p.hospitalAllowance}
                    </div>
                  </td>
                  <td>
                    <strong style={{ fontSize: '1.05rem', color: '#059669', fontFamily: 'monospace' }}>
                      ₹{(p.netPayable || 0).toLocaleString('en-IN')}
                    </strong>
                  </td>
                  <td>
                    <div style={{ fontSize: '0.78rem', color: '#334155' }}>{p.paymentMethod}</div>
                    <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontFamily: 'monospace' }}>
                      {p.transactionReference}
                    </div>
                  </td>
                  <td>
                    <span className="badge badge-paid">
                      <CheckCircle2 size={12} /> {p.paymentStatus}
                    </span>
                  </td>
                  <td style={{ textAlign: 'right' }}>
                    <button
                      className="btn btn-outline btn-sm"
                      title="View & Print Official Wage Slip"
                      onClick={() => onSelectSlipToPrint(p)}
                    >
                      <Eye size={14} /> Slip
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

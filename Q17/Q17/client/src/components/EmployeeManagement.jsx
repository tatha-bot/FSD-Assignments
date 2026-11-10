import React, { useState, useEffect } from 'react';
import { 
  UserPlus, 
  Search, 
  Edit3, 
  Trash2, 
  IndianRupee, 
  Phone, 
  Clock, 
  Building,
  CreditCard,
  X,
  Check
} from 'lucide-react';
import { api } from '../services/api';

const ROLES = [
  'Ward Boy',
  'Housekeeping / Sanitation',
  'Stretcher Bearer',
  'Security Guard',
  'Ayah / Caretaker',
  'Maintenance / Electrician',
  'Laundry Staff',
  'Dietary / Canteen Staff',
  'Lab Attendant'
];

const DEPARTMENTS = [
  'Emergency & Trauma',
  'Intensive Care Unit (ICU)',
  'Housekeeping & Sanitation',
  'General Wards',
  'Operation Theatre (OT)',
  'Security & Safety',
  'Dietary & Nutrition',
  'Maintenance & Facilities'
];

const SHIFTS = [
  'Morning (06:00 - 14:00)',
  'Evening (14:00 - 22:00)',
  'Night (22:00 - 06:00)',
  'General (09:00 - 17:00)'
];

export default function EmployeeManagement({ onSelectEmployeeForSalary, onDataChanged }) {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDept, setSelectedDept] = useState('All');
  const [showModal, setShowModal] = useState(false);
  const [editingEmp, setEditingEmp] = useState(null);

  // Form state
  const [formData, setFormData] = useState({
    empId: '',
    name: '',
    role: 'Ward Boy',
    department: 'Emergency & Trauma',
    phone: '',
    dailyWageRate: 600,
    overtimeHourlyRate: 110,
    shift: 'Morning (06:00 - 14:00)',
    status: 'Active',
    bankAccount: {
      accountNumber: '',
      ifscCode: '',
      bankName: '',
      upiId: ''
    }
  });

  const loadEmployees = async () => {
    try {
      setLoading(true);
      const data = await api.getEmployees({
        q: searchTerm,
        department: selectedDept !== 'All' ? selectedDept : undefined
      });
      setEmployees(data);
    } catch (err) {
      console.error('Failed to load employees:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadEmployees();
  }, [selectedDept]);

  const handleSearch = (e) => {
    e.preventDefault();
    loadEmployees();
  };

  const openAddModal = () => {
    setEditingEmp(null);
    const nextId = `HSP-DW-${101 + employees.length}`;
    setFormData({
      empId: nextId,
      name: '',
      role: 'Ward Boy',
      department: 'Emergency & Trauma',
      phone: '',
      dailyWageRate: 650,
      overtimeHourlyRate: 120,
      shift: 'Morning (06:00 - 14:00)',
      status: 'Active',
      bankAccount: {
        accountNumber: '',
        ifscCode: '',
        bankName: '',
        upiId: ''
      }
    });
    setShowModal(true);
  };

  const openEditModal = (emp) => {
    setEditingEmp(emp);
    setFormData({
      empId: emp.empId,
      name: emp.name,
      role: emp.role,
      department: emp.department,
      phone: emp.phone || '',
      dailyWageRate: emp.dailyWageRate,
      overtimeHourlyRate: emp.overtimeHourlyRate,
      shift: emp.shift || 'General (09:00 - 17:00)',
      status: emp.status || 'Active',
      bankAccount: {
        accountNumber: emp.bankAccount?.accountNumber || '',
        ifscCode: emp.bankAccount?.ifscCode || '',
        bankName: emp.bankAccount?.bankName || '',
        upiId: emp.bankAccount?.upiId || ''
      }
    });
    setShowModal(true);
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingEmp) {
        await api.updateEmployee(editingEmp._id || editingEmp.empId, formData);
      } else {
        await api.createEmployee(formData);
      }
      setShowModal(false);
      loadEmployees();
      if (onDataChanged) onDataChanged();
    } catch (err) {
      alert('Error saving employee: ' + err.message);
    }
  };

  const handleDelete = async (emp) => {
    if (window.confirm(`Are you sure you want to delete ${emp.name} (${emp.empId})?`)) {
      try {
        await api.deleteEmployee(emp._id || emp.empId);
        loadEmployees();
        if (onDataChanged) onDataChanged();
      } catch (err) {
        alert('Error deleting employee: ' + err.message);
      }
    }
  };

  return (
    <div className="employees-view">
      <div className="section-header">
        <div>
          <h2 className="section-title">Hospital Daily Wage Staff Directory</h2>
          <p className="section-subtitle">
            Manage daily wage employees, assigned wards, daily rates, and banking credentials
          </p>
        </div>
        <button className="btn btn-primary" onClick={openAddModal}>
          <UserPlus size={16} /> Add Daily Wage Worker
        </button>
      </div>

      {/* Filter toolbar */}
      <div className="toolbar">
        <form onSubmit={handleSearch} style={{ display: 'flex', gap: '0.5rem', flex: 1 }}>
          <div className="search-input-wrap">
            <Search size={16} color="var(--text-muted)" />
            <input
              type="text"
              placeholder="Search by worker name, ID (e.g. HSP-DW-101), role..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <button type="submit" className="btn btn-secondary">Search</button>
        </form>

        <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
          <label style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-muted)' }}>Department:</label>
          <select
            className="select-ctrl"
            value={selectedDept}
            onChange={(e) => setSelectedDept(e.target.value)}
          >
            <option value="All">All Hospital Units</option>
            {DEPARTMENTS.map(d => (
              <option key={d} value={d}>{d}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Employees Table */}
      <div className="table-container">
        {loading ? (
          <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)' }}>Loading staff records...</div>
        ) : employees.length === 0 ? (
          <div style={{ padding: '3rem', textAlign: 'center' }}>
            <p style={{ color: 'var(--text-muted)', marginBottom: '1rem' }}>No daily wage workers found matching criteria.</p>
            <button className="btn btn-primary" onClick={openAddModal}>
              <UserPlus size={16} /> Register First Worker
            </button>
          </div>
        ) : (
          <table className="data-table">
            <thead>
              <tr>
                <th>Emp ID</th>
                <th>Employee Name & Contact</th>
                <th>Role / Designation</th>
                <th>Assigned Department</th>
                <th>Daily Wage (₹)</th>
                <th>OT Rate (₹/hr)</th>
                <th>Default Shift</th>
                <th>Payment Route</th>
                <th style={{ textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {employees.map((emp) => (
                <tr key={emp.empId || emp._id}>
                  <td style={{ fontFamily: 'monospace', fontWeight: '700', color: '#0369a1' }}>
                    {emp.empId}
                  </td>
                  <td>
                    <div style={{ fontWeight: '700', color: '#0f172a' }}>{emp.name}</div>
                    <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                      <Phone size={12} /> {emp.phone || 'No phone'}
                    </div>
                  </td>
                  <td>
                    <span className="badge badge-role">{emp.role}</span>
                  </td>
                  <td>
                    <span className="badge badge-dept">{emp.department}</span>
                  </td>
                  <td>
                    <strong style={{ color: '#047857', fontSize: '0.95rem' }}>
                      ₹{emp.dailyWageRate}
                    </strong>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}> / day</span>
                  </td>
                  <td>
                    <span style={{ color: '#475569', fontWeight: 600 }}>₹{emp.overtimeHourlyRate}</span>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}> / hr</span>
                  </td>
                  <td>
                    <div style={{ fontSize: '0.8rem', color: '#334155', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                      <Clock size={12} /> {emp.shift?.split(' ')[0] || 'Morning'}
                    </div>
                  </td>
                  <td>
                    <div style={{ fontSize: '0.78rem', color: '#475569' }}>
                      {emp.bankAccount?.upiId ? (
                        <span style={{ color: '#0284c7', fontWeight: 600 }}>UPI: {emp.bankAccount.upiId}</span>
                      ) : emp.bankAccount?.accountNumber ? (
                        <span>Bank: *{emp.bankAccount.accountNumber.slice(-4)}</span>
                      ) : (
                        <span style={{ color: '#64748b' }}>Cash Counter</span>
                      )}
                    </div>
                  </td>
                  <td style={{ textAlign: 'right' }}>
                    <div style={{ display: 'inline-flex', gap: '0.4rem' }}>
                      <button
                        className="btn btn-success btn-sm"
                        title="Disburse Daily Salary"
                        onClick={() => onSelectEmployeeForSalary(emp)}
                      >
                        <IndianRupee size={14} /> Pay
                      </button>
                      <button
                        className="btn btn-secondary btn-sm"
                        title="Edit Details"
                        onClick={() => openEditModal(emp)}
                      >
                        <Edit3 size={14} />
                      </button>
                      <button
                        className="btn btn-danger btn-sm"
                        title="Delete Worker"
                        onClick={() => handleDelete(emp)}
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Add / Edit Worker Modal */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal-card">
            <div className="modal-header">
              <h3>{editingEmp ? 'Edit Daily Wage Staff' : 'Register Daily Wage Employee'}</h3>
              <button 
                onClick={() => setShowModal(false)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleFormSubmit}>
              <div className="modal-body">
                <div className="form-grid">
                  <div className="form-group">
                    <label>Employee ID *</label>
                    <input
                      type="text"
                      required
                      value={formData.empId}
                      onChange={(e) => setFormData({ ...formData, empId: e.target.value })}
                      placeholder="e.g. HSP-DW-108"
                    />
                  </div>

                  <div className="form-group">
                    <label>Worker Full Name *</label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="e.g. Rajesh Paswan"
                    />
                  </div>

                  <div className="form-group">
                    <label>Role / Designation *</label>
                    <select
                      value={formData.role}
                      onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                    >
                      {ROLES.map(r => (
                        <option key={r} value={r}>{r}</option>
                      ))}
                    </select>
                  </div>

                  <div className="form-group">
                    <label>Hospital Department *</label>
                    <select
                      value={formData.department}
                      onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                    >
                      {DEPARTMENTS.map(d => (
                        <option key={d} value={d}>{d}</option>
                      ))}
                    </select>
                  </div>

                  <div className="form-group">
                    <label>Daily Wage Rate (₹) *</label>
                    <input
                      type="number"
                      required
                      min="100"
                      value={formData.dailyWageRate}
                      onChange={(e) => {
                        const wage = Number(e.target.value);
                        setFormData({ 
                          ...formData, 
                          dailyWageRate: wage,
                          overtimeHourlyRate: Math.round((wage / 8) * 1.5)
                        });
                      }}
                      placeholder="e.g. 650"
                    />
                  </div>

                  <div className="form-group">
                    <label>Overtime Hourly Rate (₹/hr) *</label>
                    <input
                      type="number"
                      required
                      min="0"
                      value={formData.overtimeHourlyRate}
                      onChange={(e) => setFormData({ ...formData, overtimeHourlyRate: Number(e.target.value) })}
                      placeholder="e.g. 120"
                    />
                  </div>

                  <div className="form-group">
                    <label>Default Hospital Shift</label>
                    <select
                      value={formData.shift}
                      onChange={(e) => setFormData({ ...formData, shift: e.target.value })}
                    >
                      {SHIFTS.map(s => (
                        <option key={s} value={s}>{s}</option>
                      ))}
                    </select>
                  </div>

                  <div className="form-group">
                    <label>Phone / Mobile Contact</label>
                    <input
                      type="text"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      placeholder="e.g. +91 98765 43210"
                    />
                  </div>

                  <div className="form-group full">
                    <div style={{ fontSize: '0.85rem', fontWeight: '700', color: '#0369a1', borderTop: '1px solid var(--border)', paddingTop: '0.75rem', marginTop: '0.5rem' }}>
                      Disbursal / Banking Credentials (Optional)
                    </div>
                  </div>

                  <div className="form-group">
                    <label>UPI ID (for Instant Payment)</label>
                    <input
                      type="text"
                      value={formData.bankAccount.upiId}
                      onChange={(e) => setFormData({
                        ...formData,
                        bankAccount: { ...formData.bankAccount, upiId: e.target.value }
                      })}
                      placeholder="e.g. name@upi or paytm"
                    />
                  </div>

                  <div className="form-group">
                    <label>Bank Account Number</label>
                    <input
                      type="text"
                      value={formData.bankAccount.accountNumber}
                      onChange={(e) => setFormData({
                        ...formData,
                        bankAccount: { ...formData.bankAccount, accountNumber: e.target.value }
                      })}
                      placeholder="e.g. 918273645012"
                    />
                  </div>

                  <div className="form-group">
                    <label>IFSC Code</label>
                    <input
                      type="text"
                      value={formData.bankAccount.ifscCode}
                      onChange={(e) => setFormData({
                        ...formData,
                        bankAccount: { ...formData.bankAccount, ifscCode: e.target.value }
                      })}
                      placeholder="e.g. SBIN0001234"
                    />
                  </div>

                  <div className="form-group">
                    <label>Bank Name</label>
                    <input
                      type="text"
                      value={formData.bankAccount.bankName}
                      onChange={(e) => setFormData({
                        ...formData,
                        bankAccount: { ...formData.bankAccount, bankName: e.target.value }
                      })}
                      placeholder="e.g. State Bank of India"
                    />
                  </div>
                </div>
              </div>

              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  {editingEmp ? 'Save Changes' : 'Register Daily Wage Worker'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

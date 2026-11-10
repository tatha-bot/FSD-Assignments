import React, { useState, useEffect } from 'react';
import { X, CheckCircle, AlertCircle } from 'lucide-react';

const DEPARTMENTS = [
  'Engineering',
  'Human Resources',
  'Marketing',
  'Finance',
  'Design',
  'Sales',
  'Operations',
  'Other'
];

export default function EmployeeModal({ isOpen, onClose, onSave, employeeToEdit }) {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    department: 'Engineering',
    position: '',
    salary: '',
    status: 'Active'
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (employeeToEdit) {
      setFormData({
        firstName: employeeToEdit.firstName || '',
        lastName: employeeToEdit.lastName || '',
        email: employeeToEdit.email || '',
        phone: employeeToEdit.phone || '',
        department: employeeToEdit.department || 'Engineering',
        position: employeeToEdit.position || '',
        salary: employeeToEdit.salary || '',
        status: employeeToEdit.status || 'Active'
      });
    } else {
      setFormData({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        department: 'Engineering',
        position: '',
        salary: '',
        status: 'Active'
      });
    }
    setError('');
  }, [employeeToEdit, isOpen]);

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!formData.firstName.trim() || !formData.lastName.trim() || !formData.email.trim() || !formData.position.trim()) {
      return setError('Please fill in all required text fields.');
    }
    if (!formData.salary || Number(formData.salary) <= 0) {
      return setError('Please provide a valid positive salary amount.');
    }

    try {
      setLoading(true);
      await onSave({
        ...formData,
        salary: Number(formData.salary)
      });
      onClose();
    } catch (err) {
      setError(err.message || 'Operation failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-card" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h3>{employeeToEdit ? 'Edit Employee Details' : 'Add New Employee'}</h3>
          <button
            onClick={onClose}
            style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}
          >
            <X size={20} />
          </button>
        </div>

        <div className="modal-body">
          {error && (
            <div style={{ background: '#fef2f2', color: '#b91c1c', padding: '10px 14px', borderRadius: '8px', fontSize: '0.85rem', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <AlertCircle size={16} />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="form-grid">
              <div className="form-field">
                <label>First Name *</label>
                <input
                  type="text"
                  name="firstName"
                  placeholder="e.g. Rahul"
                  value={formData.firstName}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-field">
                <label>Last Name *</label>
                <input
                  type="text"
                  name="lastName"
                  placeholder="e.g. Sharma"
                  value={formData.lastName}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="form-grid">
              <div className="form-field">
                <label>Work Email Address *</label>
                <input
                  type="email"
                  name="email"
                  placeholder="rahul@company.com"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-field">
                <label>Phone Number</label>
                <input
                  type="tel"
                  name="phone"
                  placeholder="+91 98765 00000"
                  value={formData.phone}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="form-grid">
              <div className="form-field">
                <label>Department *</label>
                <select name="department" value={formData.department} onChange={handleChange}>
                  {DEPARTMENTS.map(d => (
                    <option key={d} value={d}>{d}</option>
                  ))}
                </select>
              </div>

              <div className="form-field">
                <label>Position / Job Title *</label>
                <input
                  type="text"
                  name="position"
                  placeholder="e.g. Senior Software Engineer"
                  value={formData.position}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="form-grid">
              <div className="form-field">
                <label>Annual Salary ($) *</label>
                <input
                  type="number"
                  name="salary"
                  min="0"
                  step="500"
                  placeholder="e.g. 95000"
                  value={formData.salary}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-field">
                <label>Employment Status</label>
                <select name="status" value={formData.status} onChange={handleChange}>
                  <option value="Active">Active</option>
                  <option value="On Leave">On Leave</option>
                  <option value="Terminated">Terminated</option>
                </select>
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '20px' }}>
              <button
                type="button"
                className="btn-outline"
                style={{ color: '#475569', borderColor: '#cbd5e1' }}
                onClick={onClose}
                disabled={loading}
              >
                Cancel
              </button>
              <button type="submit" className="btn-primary" disabled={loading}>
                {loading ? 'Saving...' : employeeToEdit ? 'Update Employee' : 'Add Employee'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

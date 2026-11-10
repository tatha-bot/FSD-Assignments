import React from 'react';
import { X, Mail, Phone, Calendar, DollarSign, Building2, Briefcase, ShieldCheck } from 'lucide-react';

export default function EmployeeDetailModal({ employee, onClose, onEdit }) {
  if (!employee) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-card" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <div>
            <h3>Employee Profile</h3>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>ID: {employee._id}</p>
          </div>
          <button
            onClick={onClose}
            style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}
          >
            <X size={20} />
          </button>
        </div>

        <div className="modal-body">
          <div style={{ textAlign: 'center', marginBottom: '24px' }}>
            <div
              style={{
                width: '64px',
                height: '64px',
                borderRadius: '50%',
                background: 'linear-gradient(135deg, #2563eb, #3b82f6)',
                color: '#fff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '1.4rem',
                fontWeight: 800,
                margin: '0 auto 12px auto'
              }}
            >
              {employee.firstName[0]}{employee.lastName[0]}
            </div>
            <h2 style={{ fontSize: '1.3rem', fontWeight: 800 }}>
              {employee.firstName} {employee.lastName}
            </h2>
            <p style={{ color: 'var(--primary)', fontWeight: 600 }}>{employee.position}</p>
            <div style={{ marginTop: '8px' }}>
              <span className="badge-dept">{employee.department}</span>{' '}
              <span className={`badge-status ${employee.status === 'Active' ? 'status-active' : employee.status === 'On Leave' ? 'status-leave' : 'status-terminated'}`}>
                ● {employee.status}
              </span>
            </div>
          </div>

          <div style={{ background: '#f8fafc', border: '1px solid var(--border)', borderRadius: '12px', padding: '16px', display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '0.9rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <Mail size={16} color="#64748b" />
              <span>Email: <strong>{employee.email}</strong></span>
            </div>

            {employee.phone && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <Phone size={16} color="#64748b" />
                <span>Phone: <strong>{employee.phone}</strong></span>
              </div>
            )}

            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <DollarSign size={16} color="#64748b" />
              <span>Annual Salary: <strong className="mono">${Number(employee.salary).toLocaleString()}</strong></span>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <Calendar size={16} color="#64748b" />
              <span>Hire Date: <strong>{new Date(employee.hireDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</strong></span>
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '24px' }}>
            <button
              type="button"
              className="btn-outline"
              style={{ color: '#475569', borderColor: '#cbd5e1' }}
              onClick={onClose}
            >
              Close
            </button>
            <button
              type="button"
              className="btn-primary"
              onClick={() => {
                onClose();
                onEdit(employee);
              }}
            >
              Edit Employee Details
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

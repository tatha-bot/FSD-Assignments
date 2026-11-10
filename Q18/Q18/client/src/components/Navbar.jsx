import React from 'react';
import { Users, UserPlus, RefreshCw } from 'lucide-react';

export default function Navbar({ onOpenAdd, onResetDemo, count }) {
  return (
    <header className="navbar">
      <div className="container nav-inner">
        <div className="brand-group">
          <div className="brand-icon">
            <Users size={20} />
          </div>
          <div>
            <h1 className="brand-title">EmployeeHub</h1>
            <span className="brand-subtitle">Enterprise Directory System (MERN)</span>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <button className="btn-primary" onClick={onOpenAdd}>
            <UserPlus size={16} />
            <span>Add Employee</span>
          </button>

          <button
            className="btn-outline"
            onClick={onResetDemo}
            title="Reset demo records"
          >
            <RefreshCw size={14} />
            <span>Reset Demo</span>
          </button>
        </div>
      </div>
    </header>
  );
}

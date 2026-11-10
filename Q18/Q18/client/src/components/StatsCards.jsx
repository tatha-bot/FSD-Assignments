import React from 'react';
import { Users, DollarSign, Building2, CheckCircle2 } from 'lucide-react';

export default function StatsCards({ stats }) {
  const departmentCount = Object.keys(stats?.departmentBreakdown || {}).length;

  return (
    <div className="stats-grid">
      <div className="stat-card">
        <div className="stat-icon-wrap" style={{ background: '#eff6ff', color: '#2563eb' }}>
          <Users size={22} />
        </div>
        <div>
          <div className="stat-number">{stats?.total || 0}</div>
          <div className="stat-label">Total Employees</div>
        </div>
      </div>

      <div className="stat-card">
        <div className="stat-icon-wrap" style={{ background: '#ecfdf5', color: '#059669' }}>
          <CheckCircle2 size={22} />
        </div>
        <div>
          <div className="stat-number">{stats?.activeCount || 0}</div>
          <div className="stat-label">Active Staff</div>
        </div>
      </div>

      <div className="stat-card">
        <div className="stat-icon-wrap" style={{ background: '#fef3c7', color: '#d97706' }}>
          <DollarSign size={22} />
        </div>
        <div>
          <div className="stat-number mono">${(stats?.avgSalary || 0).toLocaleString()}</div>
          <div className="stat-label">Average Annual Salary</div>
        </div>
      </div>

      <div className="stat-card">
        <div className="stat-icon-wrap" style={{ background: '#f3e8ff', color: '#7e22ce' }}>
          <Building2 size={22} />
        </div>
        <div>
          <div className="stat-number">{departmentCount}</div>
          <div className="stat-label">Departments</div>
        </div>
      </div>
    </div>
  );
}

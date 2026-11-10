import React from 'react';
import { 
  Building2, 
  Users, 
  CalendarCheck2, 
  Banknote, 
  Receipt, 
  LayoutDashboard,
  ShieldCheck,
  Database
} from 'lucide-react';

export default function Navbar({ activeTab, setActiveTab, dbMode, refreshStats }) {
  const tabs = [
    { id: 'dashboard', label: 'Admin Dashboard', icon: LayoutDashboard },
    { id: 'employees', label: 'Daily Wage Staff', icon: Users },
    { id: 'attendance', label: 'Daily Attendance', icon: CalendarCheck2 },
    { id: 'salary', label: 'Salary Disbursal', icon: Banknote },
    { id: 'payments', label: 'Wage Receipts & History', icon: Receipt },
  ];

  return (
    <header className="navbar">
      <div className="navbar-inner">
        <div className="brand">
          <div className="brand-icon">
            <Building2 size={24} />
          </div>
          <div>
            <div className="brand-title">MEDICARE SUPER-SPECIALITY HOSPITAL</div>
            <div className="brand-subtitle">Daily Wage Staff Payroll & Administration Portal (MERN)</div>
          </div>
        </div>

        <nav className="nav-tabs">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                className={`nav-btn ${isActive ? 'active' : ''}`}
                onClick={() => setActiveTab(tab.id)}
              >
                <Icon size={16} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </nav>

        <div className="db-badge" title="Database Storage Engine">
          <div className="db-indicator"></div>
          <Database size={13} />
          <span>{dbMode || 'MERN Database Connected'}</span>
        </div>
      </div>
    </header>
  );
}

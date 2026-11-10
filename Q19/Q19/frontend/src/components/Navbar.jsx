import React from 'react';
import { Briefcase, PlusCircle, LayoutDashboard, RefreshCw, Search } from 'lucide-react';

export default function Navbar({ activeTab, setActiveTab, onOpenPostModal, onSeedDemo, jobCount }) {
  return (
    <header className="navbar">
      <div className="container nav-content">
        <div className="logo-group" onClick={() => setActiveTab('vacancies')}>
          <div className="logo-badge">
            <Briefcase size={22} />
          </div>
          <div className="logo-text">
            <h1>OpportunityHub</h1>
            <span>MERN Career & Vacancy Portal</span>
          </div>
        </div>

        <nav className="nav-links">
          <button
            className={`nav-btn ${activeTab === 'vacancies' ? 'active' : ''}`}
            onClick={() => setActiveTab('vacancies')}
          >
            <Search size={18} />
            <span>Browse Vacancies ({jobCount})</span>
          </button>

          <button
            className={`nav-btn ${activeTab === 'dashboard' ? 'active' : ''}`}
            onClick={() => setActiveTab('dashboard')}
          >
            <LayoutDashboard size={18} />
            <span>Recruiter Dashboard</span>
          </button>

          <button
            className="nav-btn nav-btn-primary"
            onClick={onOpenPostModal}
          >
            <PlusCircle size={18} />
            <span>Post a Vacancy</span>
          </button>

          <button
            className="nav-btn"
            title="Load demo vacancies"
            onClick={onSeedDemo}
          >
            <RefreshCw size={16} />
            <span>Demo Data</span>
          </button>
        </nav>
      </div>
    </header>
  );
}

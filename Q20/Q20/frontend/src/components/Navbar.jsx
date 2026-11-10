import React from 'react';
import { Landmark, UserCheck, ShieldCheck, UserPlus, RefreshCw, Layers } from 'lucide-react';

export default function Navbar({ activeView, setActiveView, onOpenAccountModal, onResetDemo }) {
  return (
    <header className="navbar">
      <div className="container nav-inner">
        <div className="brand-group" onClick={() => setActiveView('customer')}>
          <div className="brand-icon">
            <Landmark size={22} />
          </div>
          <div className="brand-text">
            <h1>TrustBank Savings</h1>
            <span>MERN Secure Account Portal</span>
          </div>
        </div>

        <div className="nav-actions">
          <button
            className={`nav-tab-btn ${activeView === 'customer' ? 'active' : ''}`}
            onClick={() => setActiveView('customer')}
          >
            <UserCheck size={16} />
            <span>Account Holder View</span>
          </button>

          <button
            className={`nav-tab-btn ${activeView === 'admin' ? 'active' : ''}`}
            onClick={() => setActiveView('admin')}
          >
            <Layers size={16} />
            <span>Bank Manager Portal</span>
          </button>

          <button className="btn-open-acc" onClick={onOpenAccountModal}>
            <UserPlus size={16} />
            <span>Open Savings Account</span>
          </button>

          <button
            className="nav-tab-btn"
            style={{ padding: '8px 10px' }}
            title="Reset to initial seed accounts"
            onClick={onResetDemo}
          >
            <RefreshCw size={15} />
          </button>
        </div>
      </div>
    </header>
  );
}

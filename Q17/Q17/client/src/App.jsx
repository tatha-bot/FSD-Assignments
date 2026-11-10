import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import DashboardStats from './components/DashboardStats';
import EmployeeManagement from './components/EmployeeManagement';
import AttendanceTracker from './components/AttendanceTracker';
import SalaryCalculator from './components/SalaryCalculator';
import PaymentHistory from './components/PaymentHistory';
import SalarySlipModal from './components/SalarySlipModal';
import { api } from './services/api';

export default function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [stats, setStats] = useState(null);
  const [activeSlip, setActiveSlip] = useState(null);
  const [preselectedEmp, setPreselectedEmp] = useState(null);

  const refreshStats = async () => {
    try {
      const data = await api.getStats();
      setStats(data);
    } catch (err) {
      console.error('Failed to load stats:', err);
    }
  };

  useEffect(() => {
    refreshStats();
  }, []);

  const handleSelectEmployeeForSalary = (emp) => {
    setPreselectedEmp(emp);
    setActiveTab('salary');
  };

  const handlePaymentCompleted = (payment) => {
    refreshStats();
    if (payment) {
      setActiveSlip(payment);
    }
  };

  return (
    <div className="app-container">
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        dbMode={stats?.dbMode}
        refreshStats={refreshStats}
      />

      <main className="main-content">
        {activeTab === 'dashboard' && (
          <DashboardStats
            stats={stats}
            setActiveTab={setActiveTab}
            onRefresh={refreshStats}
          />
        )}

        {activeTab === 'employees' && (
          <EmployeeManagement
            onSelectEmployeeForSalary={handleSelectEmployeeForSalary}
            onDataChanged={refreshStats}
          />
        )}

        {activeTab === 'attendance' && (
          <AttendanceTracker
            onNavigateToSalary={(emp) => {
              setPreselectedEmp(emp);
              setActiveTab('salary');
            }}
            onDataChanged={refreshStats}
          />
        )}

        {activeTab === 'salary' && (
          <SalaryCalculator
            preselectedEmp={preselectedEmp}
            onPaymentCompleted={handlePaymentCompleted}
          />
        )}

        {activeTab === 'payments' && (
          <PaymentHistory
            onSelectSlipToPrint={(p) => setActiveSlip(p)}
          />
        )}
      </main>

      {/* Salary Slip Modal */}
      {activeSlip && (
        <SalarySlipModal
          payment={activeSlip}
          onClose={() => setActiveSlip(null)}
        />
      )}

      {/* Footer */}
      <footer style={{ borderTop: '1px solid var(--border)', background: '#ffffff', padding: '1.25rem 1.5rem', textAlign: 'center', fontSize: '0.82rem', color: 'var(--text-muted)' }} className="no-print">
        <div style={{ maxWidth: '1400px', margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.75rem' }}>
          <div>
            <strong>Hospital Administration Daily Wage Salary System</strong> &bull; Developed with MERN Stack (MongoDB, Express, React, Node.js)
          </div>
          <div>
            Medicare Super-Speciality Hospital Administration &copy; {new Date().getFullYear()}
          </div>
        </div>
      </footer>
    </div>
  );
}

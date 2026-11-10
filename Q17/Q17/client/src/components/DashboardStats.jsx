import React from 'react';
import { 
  Users, 
  UserCheck, 
  IndianRupee, 
  CreditCard, 
  Clock, 
  ArrowRight,
  Sparkles,
  Building,
  CheckCircle2
} from 'lucide-react';

export default function DashboardStats({ stats, setActiveTab, onRefresh }) {
  if (!stats) return <div className="text-center py-8">Loading administration dashboard...</div>;

  return (
    <div className="dashboard-view">
      <div className="section-header">
        <div>
          <h2 className="section-title">Hospital Administration Dashboard</h2>
          <p className="section-subtitle">
            Daily Wage Workforce Overview &bull; Date: {stats.todayDate || new Date().toISOString().slice(0, 10)}
          </p>
        </div>
        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <button className="btn btn-primary" onClick={() => setActiveTab('attendance')}>
            <Clock size={16} /> Mark Today's Roll-Call
          </button>
          <button className="btn btn-success" onClick={() => setActiveTab('salary')}>
            <IndianRupee size={16} /> Disburse Daily Wages
          </button>
        </div>
      </div>

      {/* Main Metric Cards */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-info">
            <div className="stat-label">Total Wage Staff</div>
            <div className="stat-value">{stats.totalEmployees || 0}</div>
            <div className="stat-sub">{stats.activeEmployees || 0} Active on Roster</div>
          </div>
          <div className="stat-icon-wrap stat-icon-blue">
            <Users size={24} />
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-info">
            <div className="stat-label">Today's Active On Duty</div>
            <div className="stat-value">{stats.todayAttendance?.present || 0}</div>
            <div className="stat-sub">
              {stats.todayAttendance?.halfDay || 0} Half-Day | {stats.todayAttendance?.absent || 0} Absent
            </div>
          </div>
          <div className="stat-icon-wrap stat-icon-emerald">
            <UserCheck size={24} />
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-info">
            <div className="stat-label">Today's Wage Liability</div>
            <div className="stat-value">₹{(stats.todayWageLiability || 0).toLocaleString('en-IN')}</div>
            <div className="stat-sub">Calculated for today's shifts + OT</div>
          </div>
          <div className="stat-icon-wrap stat-icon-amber">
            <IndianRupee size={24} />
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-info">
            <div className="stat-label">Total Disbursed</div>
            <div className="stat-value">₹{(stats.totalDisbursedAmount || 0).toLocaleString('en-IN')}</div>
            <div className="stat-sub">{stats.totalPaymentsProcessed || 0} Transactions Settled</div>
          </div>
          <div className="stat-icon-wrap stat-icon-purple">
            <CreditCard size={24} />
          </div>
        </div>
      </div>

      {/* Quick Summary Panels */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
        {/* Department Workforce Distribution */}
        <div style={{ background: '#fff', border: '1px solid var(--border)', borderRadius: 'var(--radius)', padding: '1.5rem', boxShadow: 'var(--shadow-sm)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <h3 style={{ fontSize: '1.05rem', fontWeight: '700', color: '#0f172a', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Building size={18} color="var(--primary)" />
              Daily Wage Staff by Hospital Department
            </h3>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Hospital Units</span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {Object.entries(stats.departmentDistribution || {}).map(([dept, count]) => {
              const pct = Math.round((count / (stats.totalEmployees || 1)) * 100);
              return (
                <div key={dept}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '0.25rem' }}>
                    <span style={{ fontWeight: '600', color: '#334155' }}>{dept}</span>
                    <span style={{ fontWeight: '700', color: '#0284c7' }}>{count} workers ({pct}%)</span>
                  </div>
                  <div style={{ background: '#f1f5f9', height: '7px', borderRadius: '4px', overflow: 'hidden' }}>
                    <div style={{ background: '#0284c7', height: '100%', width: `${pct}%`, borderRadius: '4px' }}></div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Daily Administration Workflow Guide */}
        <div style={{ background: '#fff', border: '1px solid var(--border)', borderRadius: 'var(--radius)', padding: '1.5rem', boxShadow: 'var(--shadow-sm)' }}>
          <h3 style={{ fontSize: '1.05rem', fontWeight: '700', color: '#0f172a', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Sparkles size={18} color="#d97706" />
            Hospital Administration Daily Workflow
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-start' }}>
              <div style={{ background: '#e0f2fe', color: '#0284c7', borderRadius: '50%', width: '28px', height: '28px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', fontSize: '0.85rem', flexShrink: 0 }}>
                1
              </div>
              <div>
                <div style={{ fontWeight: '600', fontSize: '0.9rem', color: '#0f172a' }}>Register Hospital Daily Wage Staff</div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                  Manage ward boys, ayahs, sanitation crew, and security with fixed daily rates and overtime rates.
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-start' }}>
              <div style={{ background: '#d1fae5', color: '#059669', borderRadius: '50%', width: '28px', height: '28px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', fontSize: '0.85rem', flexShrink: 0 }}>
                2
              </div>
              <div>
                <div style={{ fontWeight: '600', fontSize: '0.9rem', color: '#0f172a' }}>Mark Daily Attendance & Overtime</div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                  Ward supervisors log presence, half-day, or overtime hours worked during emergency duties.
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-start' }}>
              <div style={{ background: '#fef3c7', color: '#d97706', borderRadius: '50%', width: '28px', height: '28px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', fontSize: '0.85rem', flexShrink: 0 }}>
                3
              </div>
              <div>
                <div style={{ fontWeight: '600', fontSize: '0.9rem', color: '#0f172a' }}>Calculate Wage & Disburse Salary</div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                  System auto-calculates base wage + overtime + allowances, and logs payment via Cash/UPI/NEFT.
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-start' }}>
              <div style={{ background: '#f3e8ff', color: '#9333ea', borderRadius: '50%', width: '28px', height: '28px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', fontSize: '0.85rem', flexShrink: 0 }}>
                4
              </div>
              <div>
                <div style={{ fontWeight: '600', fontSize: '0.9rem', color: '#0f172a' }}>Generate Official Hospital Wage Slips</div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                  Instantly preview, download, or print official salary slips with hospital seal & supervisor signatures.
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

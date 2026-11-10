import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import StatsCards from './components/StatsCards';
import EmployeeModal from './components/EmployeeModal';
import EmployeeDetailModal from './components/EmployeeDetailModal';
import { employeeApi } from './services/api';
import {
  Search,
  SlidersHorizontal,
  Edit2,
  Trash2,
  Eye,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
  UserX
} from 'lucide-react';

const DEPARTMENTS = [
  'All',
  'Engineering',
  'Human Resources',
  'Marketing',
  'Finance',
  'Design',
  'Sales',
  'Operations'
];

export default function App() {
  const [employees, setEmployees] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Filters
  const [search, setSearch] = useState('');
  const [selectedDept, setSelectedDept] = useState('All');
  const [sort, setSort] = useState('newest');

  // Modals
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [employeeToEdit, setEmployeeToEdit] = useState(null);
  const [employeeToView, setEmployeeToView] = useState(null);

  // Toast
  const [toast, setToast] = useState(null);

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3500);
  };

  const loadData = async () => {
    try {
      setLoading(true);
      setError('');
      const [empRes, statsRes] = await Promise.all([
        employeeApi.getEmployees({ q: search, department: selectedDept, sort }),
        employeeApi.getStats()
      ]);
      setEmployees(empRes.data || []);
      setStats(statsRes.data || null);
    } catch (err) {
      setError(err.message || 'Could not connect to Employee API');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [selectedDept, sort]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    loadData();
  };

  const handleSaveEmployee = async (formData) => {
    try {
      if (employeeToEdit) {
        await employeeApi.updateEmployee(employeeToEdit._id, formData);
        showToast(`Updated details for ${formData.firstName} ${formData.lastName}!`);
      } else {
        await employeeApi.createEmployee(formData);
        showToast(`Employee ${formData.firstName} ${formData.lastName} added successfully!`);
      }
      loadData();
    } catch (err) {
      showToast(err.message, 'error');
      throw err;
    }
  };

  const handleDeleteEmployee = async (id, name) => {
    if (!window.confirm(`Are you sure you want to delete employee record: "${name}"?`)) return;
    try {
      await employeeApi.deleteEmployee(id);
      showToast(`Employee record "${name}" deleted.`);
      loadData();
    } catch (err) {
      showToast(err.message, 'error');
    }
  };

  const handleResetDemo = async () => {
    try {
      setLoading(true);
      await employeeApi.resetDemo();
      showToast('Reset sample employee directory records!');
      setSearch('');
      setSelectedDept('All');
      loadData();
    } catch (err) {
      showToast(err.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Navbar
        onOpenAdd={() => {
          setEmployeeToEdit(null);
          setIsModalOpen(true);
        }}
        onResetDemo={handleResetDemo}
        count={employees.length}
      />

      {toast && (
        <div className={`toast ${toast.type === 'error' ? 'toast-error' : 'toast-success'}`}>
          {toast.type === 'error' ? <AlertCircle size={16} /> : <CheckCircle2 size={16} />}
          <span>{toast.message}</span>
        </div>
      )}

      <main className="container" style={{ flex: 1, paddingBottom: '40px' }}>
        <StatsCards stats={stats} />

        {/* Search & Department Toolbar */}
        <div className="toolbar-card">
          <form onSubmit={handleSearchSubmit} className="search-input-wrap">
            <Search size={16} color="var(--text-muted)" />
            <input
              type="text"
              placeholder="Search by employee name, role, email..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <button
              type="submit"
              style={{
                background: 'var(--primary)',
                color: '#fff',
                border: 'none',
                padding: '4px 10px',
                borderRadius: '6px',
                cursor: 'pointer',
                fontSize: '0.8rem',
                fontWeight: 600
              }}
            >
              Search
            </button>
          </form>

          {/* Department Pills */}
          <div className="dept-pills">
            {DEPARTMENTS.map((dept) => (
              <button
                key={dept}
                className={`dept-pill ${selectedDept === dept ? 'active' : ''}`}
                onClick={() => setSelectedDept(dept)}
              >
                {dept}
              </button>
            ))}
          </div>

          {/* Sorting */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <SlidersHorizontal size={14} color="var(--text-muted)" />
            <select
              style={{
                padding: '6px 10px',
                borderRadius: '6px',
                border: '1px solid var(--border)',
                background: '#fff',
                fontSize: '0.8rem',
                fontFamily: 'inherit'
              }}
              value={sort}
              onChange={(e) => setSort(e.target.value)}
            >
              <option value="newest">Newest First</option>
              <option value="name_asc">Name (A-Z)</option>
              <option value="name_desc">Name (Z-A)</option>
              <option value="salary_desc">Salary (High to Low)</option>
              <option value="salary_asc">Salary (Low to High)</option>
            </select>
          </div>
        </div>

        {error && (
          <div style={{ background: '#fef2f2', border: '1px solid #fecaca', color: '#b91c1c', padding: '12px 16px', borderRadius: '8px', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <AlertCircle size={18} />
            <span>{error}</span>
          </div>
        )}

        {/* Data Table */}
        <div className="table-card">
          {loading ? (
            <div style={{ padding: '60px', textAlign: 'center', color: 'var(--text-muted)' }}>
              <RefreshCw size={28} className="animate-spin" style={{ margin: '0 auto 8px auto' }} />
              <p>Fetching employee records...</p>
            </div>
          ) : employees.length === 0 ? (
            <div style={{ padding: '60px', textAlign: 'center', color: 'var(--text-muted)' }}>
              <UserX size={40} style={{ margin: '0 auto 10px auto', opacity: 0.5 }} />
              <h4 style={{ fontWeight: 700, fontSize: '1.1rem', marginBottom: '4px' }}>No Employees Found</h4>
              <p style={{ fontSize: '0.85rem' }}>No records match your search criteria. Try resetting filters.</p>
              <button
                className="btn-outline"
                style={{ margin: '14px auto 0 auto', color: 'var(--primary)', borderColor: 'var(--primary)' }}
                onClick={() => {
                  setSearch('');
                  setSelectedDept('All');
                  loadData();
                }}
              >
                Clear Search & Filters
              </button>
            </div>
          ) : (
            <div style={{ overflowX: 'auto' }}>
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Employee Name</th>
                    <th>Email Address</th>
                    <th>Department</th>
                    <th>Position / Designation</th>
                    <th>Annual Salary</th>
                    <th>Hire Date</th>
                    <th>Status</th>
                    <th style={{ textAlign: 'right' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {employees.map((emp) => (
                    <tr key={emp._id}>
                      <td>
                        <strong style={{ color: 'var(--text-main)', fontSize: '0.9rem' }}>
                          {emp.firstName} {emp.lastName}
                        </strong>
                      </td>
                      <td style={{ color: '#475569' }}>{emp.email}</td>
                      <td>
                        <span className="badge-dept">{emp.department}</span>
                      </td>
                      <td>{emp.position}</td>
                      <td className="mono" style={{ fontWeight: 700 }}>
                        ${Number(emp.salary).toLocaleString()}
                      </td>
                      <td style={{ color: '#64748b' }}>
                        {new Date(emp.hireDate).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric'
                        })}
                      </td>
                      <td>
                        <span className={`badge-status ${emp.status === 'Active' ? 'status-active' : emp.status === 'On Leave' ? 'status-leave' : 'status-terminated'}`}>
                          ● {emp.status}
                        </span>
                      </td>
                      <td style={{ textAlign: 'right' }}>
                        <div style={{ display: 'inline-flex', gap: '4px' }}>
                          <button
                            className="action-btn-sm"
                            title="View Profile"
                            onClick={() => setEmployeeToView(emp)}
                          >
                            <Eye size={16} />
                          </button>
                          <button
                            className="action-btn-sm"
                            title="Edit Record"
                            onClick={() => {
                              setEmployeeToEdit(emp);
                              setIsModalOpen(true);
                            }}
                          >
                            <Edit2 size={16} />
                          </button>
                          <button
                            className="action-btn-sm"
                            style={{ color: '#ef4444' }}
                            title="Delete Employee"
                            onClick={() => handleDeleteEmployee(emp._id, `${emp.firstName} ${emp.lastName}`)}
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>

      <footer style={{ background: 'var(--dark)', color: '#94a3b8', padding: '20px 0', borderTop: '1px solid #1e293b', fontSize: '0.8rem' }}>
        <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px' }}>
          <div>
            <strong>EmployeeHub</strong> — MERN Stack Employee Management Directory System
          </div>
          <div>
            REST API with Express & Mongoose / In-Memory Resilience • React 18 + Vite
          </div>
        </div>
      </footer>

      <EmployeeModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEmployeeToEdit(null);
        }}
        onSave={handleSaveEmployee}
        employeeToEdit={employeeToEdit}
      />

      <EmployeeDetailModal
        employee={employeeToView}
        onClose={() => setEmployeeToView(null)}
        onEdit={(emp) => {
          setEmployeeToView(null);
          setEmployeeToEdit(emp);
          setIsModalOpen(true);
        }}
      />
    </div>
  );
}

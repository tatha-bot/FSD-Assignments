import React, { useState, useEffect } from 'react';
import { Briefcase, Users, CheckCircle, Clock, Trash2, ExternalLink, RefreshCw, AlertCircle } from 'lucide-react';
import { jobApi, applicationApi } from '../services/api';

export default function RecruiterDashboard({ jobs, onJobUpdated, onJobDeleted, onRefreshJobs }) {
  const [activeSubTab, setActiveSubTab] = useState('applications'); // 'applications' or 'vacancies'
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedJobFilter, setSelectedJobFilter] = useState('All');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  // Fetch applications
  const loadApplications = async () => {
    try {
      setLoading(true);
      const res = await applicationApi.getApplications();
      setApplications(res.data || []);
    } catch (err) {
      setError('Failed to fetch applications.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadApplications();
  }, []);

  // Update application status
  const handleStatusChange = async (appId, newStatus) => {
    try {
      await applicationApi.updateStatus(appId, newStatus);
      setApplications((prev) =>
        prev.map((app) => (app._id === appId ? { ...app, status: newStatus } : app))
      );
      setMessage(`Application updated to ${newStatus}`);
      setTimeout(() => setMessage(''), 3000);
    } catch (err) {
      setError('Failed to update application status.');
      setTimeout(() => setError(''), 3000);
    }
  };

  // Toggle job status Open/Closed
  const handleToggleJobStatus = async (job) => {
    const nextStatus = job.status === 'Open' ? 'Closed' : 'Open';
    try {
      const res = await jobApi.updateJob(job._id, { status: nextStatus });
      onJobUpdated(res.data);
      setMessage(`Vacancy status changed to "${nextStatus}"`);
      setTimeout(() => setMessage(''), 3000);
    } catch (err) {
      setError('Failed to update vacancy status');
      setTimeout(() => setError(''), 3000);
    }
  };

  // Delete job
  const handleDeleteJob = async (id, title) => {
    if (!window.confirm(`Are you sure you want to delete the vacancy: "${title}"?`)) return;
    try {
      await jobApi.deleteJob(id);
      onJobDeleted(id);
      loadApplications(); // Refresh applications if cascade
      setMessage(`Vacancy deleted successfully`);
      setTimeout(() => setMessage(''), 3000);
    } catch (err) {
      setError('Failed to delete vacancy');
      setTimeout(() => setError(''), 3000);
    }
  };

  // Filtered applications
  const filteredApps = selectedJobFilter === 'All'
    ? applications
    : applications.filter((a) => {
        const jId = a.jobId?._id || a.jobId;
        return String(jId) === String(selectedJobFilter);
      });

  return (
    <div className="container" style={{ paddingTop: '24px', paddingBottom: '60px' }}>
      <div className="dashboard-header">
        <div>
          <h2 style={{ fontSize: '1.75rem', fontWeight: 800 }}>Recruiter Management Dashboard</h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.925rem' }}>
            Monitor active vacancies, review incoming applicants, and update hiring statuses.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '10px' }}>
          <button
            className={`category-pill ${activeSubTab === 'applications' ? 'active' : ''}`}
            onClick={() => setActiveSubTab('applications')}
          >
            <Users size={16} style={{ display: 'inline', marginRight: '6px' }} />
            Applicant Candidates ({applications.length})
          </button>
          <button
            className={`category-pill ${activeSubTab === 'vacancies' ? 'active' : ''}`}
            onClick={() => setActiveSubTab('vacancies')}
          >
            <Briefcase size={16} style={{ display: 'inline', marginRight: '6px' }} />
            Manage Vacancies ({jobs.length})
          </button>
          <button
            className="category-pill"
            onClick={() => {
              loadApplications();
              onRefreshJobs();
            }}
            title="Refresh data"
          >
            <RefreshCw size={15} />
          </button>
        </div>
      </div>

      {message && (
        <div className="alert-toast alert-success">
          <CheckCircle size={18} />
          <span>{message}</span>
        </div>
      )}

      {error && (
        <div className="alert-toast alert-error">
          <AlertCircle size={18} />
          <span>{error}</span>
        </div>
      )}

      {/* SUB-TAB 1: APPLICANTS */}
      {activeSubTab === 'applications' && (
        <div>
          {/* Job Filter Dropdown */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
            <span style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-muted)' }}>
              Filter by Position:
            </span>
            <select
              style={{
                padding: '8px 12px',
                borderRadius: '8px',
                border: '1px solid var(--surface-border)',
                background: '#fff',
                fontSize: '0.875rem',
              }}
              value={selectedJobFilter}
              onChange={(e) => setSelectedJobFilter(e.target.value)}
            >
              <option value="All">All Jobs ({applications.length} applicants)</option>
              {jobs.map((j) => (
                <option key={j._id} value={j._id}>
                  {j.title} ({j.company})
                </option>
              ))}
            </select>
          </div>

          <div className="data-table-card">
            {filteredApps.length === 0 ? (
              <div style={{ padding: '40px', textAlign: 'center', color: 'var(--text-muted)' }}>
                <Users size={40} style={{ margin: '0 auto 12px auto', color: '#cbd5e1' }} />
                <p style={{ fontWeight: 600 }}>No applications found for this filter.</p>
                <p style={{ fontSize: '0.85rem' }}>Candidates who apply from the portal will appear here immediately.</p>
              </div>
            ) : (
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Candidate</th>
                    <th>Target Vacancy</th>
                    <th>Experience</th>
                    <th>Contact Info</th>
                    <th>Portfolio / Resume</th>
                    <th>Hiring Status</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredApps.map((app) => {
                    const jobTitle = app.jobId?.title || jobs.find((j) => String(j._id) === String(app.jobId))?.title || 'Job Listing';
                    const jobComp = app.jobId?.company || jobs.find((j) => String(j._id) === String(app.jobId))?.company || '';

                    return (
                      <tr key={app._id}>
                        <td>
                          <strong style={{ display: 'block', color: 'var(--text-main)' }}>{app.applicantName}</strong>
                          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                            Applied {new Date(app.createdAt).toLocaleDateString()}
                          </span>
                        </td>
                        <td>
                          <div style={{ fontWeight: 600 }}>{jobTitle}</div>
                          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{jobComp}</div>
                        </td>
                        <td>
                          <strong>{app.experienceYears}</strong> {app.experienceYears === 1 ? 'Year' : 'Years'}
                        </td>
                        <td>
                          <div style={{ fontSize: '0.85rem' }}>{app.applicantEmail}</div>
                          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{app.phone}</div>
                        </td>
                        <td>
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                            <a
                              href={app.resumeLink}
                              target="_blank"
                              rel="noreferrer"
                              style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '4px',
                                color: 'var(--primary)',
                                textDecoration: 'none',
                                fontWeight: 600,
                                fontSize: '0.85rem',
                              }}
                            >
                              Resume Link <ExternalLink size={13} />
                            </a>
                            {app.portfolioUrl && (
                              <a
                                href={app.portfolioUrl}
                                target="_blank"
                                rel="noreferrer"
                                style={{
                                  display: 'inline-flex',
                                  alignItems: 'center',
                                  gap: '4px',
                                  color: '#0f172a',
                                  textDecoration: 'none',
                                  fontSize: '0.8rem',
                                }}
                              >
                                Portfolio / Git <ExternalLink size={11} />
                              </a>
                            )}
                          </div>
                        </td>
                        <td>
                          <select
                            style={{
                              padding: '6px 10px',
                              borderRadius: '6px',
                              border: '1px solid var(--surface-border)',
                              fontSize: '0.825rem',
                              fontWeight: 700,
                              background: '#ffffff',
                              cursor: 'pointer',
                            }}
                            value={app.status}
                            onChange={(e) => handleStatusChange(app._id, e.target.value)}
                          >
                            <option value="Pending">🟡 Pending</option>
                            <option value="Reviewed">🔵 Reviewed</option>
                            <option value="Shortlisted">🟣 Shortlisted</option>
                            <option value="Interview">⚡ Interview</option>
                            <option value="Hired">🟢 Hired</option>
                            <option value="Rejected">🔴 Rejected</option>
                          </select>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            )}
          </div>
        </div>
      )}

      {/* SUB-TAB 2: VACANCIES MANAGEMENT */}
      {activeSubTab === 'vacancies' && (
        <div className="data-table-card">
          <table className="data-table">
            <thead>
              <tr>
                <th>Job Title & Company</th>
                <th>Category</th>
                <th>Location & Type</th>
                <th>Vacancies (Seats)</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {jobs.map((job) => (
                <tr key={job._id}>
                  <td>
                    <strong style={{ fontSize: '0.95rem' }}>{job.title}</strong>
                    <div style={{ color: 'var(--primary)', fontSize: '0.825rem', fontWeight: 600 }}>{job.company}</div>
                  </td>
                  <td>
                    <span className="tag tag-category">{job.category}</span>
                  </td>
                  <td>
                    <div>{job.location}</div>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{job.jobType}</span>
                  </td>
                  <td>
                    <strong style={{ color: '#b45309' }}>🔥 {job.vacanciesCount}</strong>
                  </td>
                  <td>
                    <button
                      onClick={() => handleToggleJobStatus(job)}
                      style={{
                        background: job.status === 'Open' ? '#ecfdf5' : '#fee2e2',
                        color: job.status === 'Open' ? '#047857' : '#b91c1c',
                        border: 'none',
                        padding: '4px 10px',
                        borderRadius: '9999px',
                        fontSize: '0.75rem',
                        fontWeight: 700,
                        cursor: 'pointer',
                      }}
                      title="Click to toggle status"
                    >
                      ● {job.status} (Toggle)
                    </button>
                  </td>
                  <td>
                    <button
                      onClick={() => handleDeleteJob(job._id, job.title)}
                      style={{
                        background: 'transparent',
                        border: 'none',
                        color: '#ef4444',
                        cursor: 'pointer',
                        padding: '6px',
                        borderRadius: '4px',
                      }}
                      title="Delete Vacancy"
                    >
                      <Trash2 size={18} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

import React, { useState } from 'react';
import { X, Send, CheckCircle2, AlertCircle, FileText, Briefcase } from 'lucide-react';
import { applicationApi } from '../services/api';

export default function ApplyModal({ job, onClose, onApplicationSuccess }) {
  const [formData, setFormData] = useState({
    applicantName: '',
    applicantEmail: '',
    phone: '',
    experienceYears: 2,
    resumeLink: '',
    portfolioUrl: '',
    coverLetter: '',
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [submittedApp, setSubmittedApp] = useState(null);

  if (!job) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!formData.applicantName.trim()) {
      return setError('Please enter your full name.');
    }
    if (!formData.applicantEmail.trim() || !formData.applicantEmail.includes('@')) {
      return setError('Please provide a valid email address.');
    }
    if (!formData.phone.trim()) {
      return setError('Please enter your contact phone number.');
    }
    if (!formData.resumeLink.trim()) {
      return setError('Please provide a link to your resume or portfolio (Google Drive, LinkedIn, etc.)');
    }

    try {
      setLoading(true);
      const res = await applicationApi.apply({
        jobId: job._id,
        ...formData,
      });

      setSubmittedApp(res.data);
      if (onApplicationSuccess) {
        onApplicationSuccess(res.data);
      }
    } catch (err) {
      setError(err.message || 'Something went wrong while submitting your application.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-card" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div>
            <h2>Apply for Vacancy</h2>
            <p style={{ color: 'var(--primary)', fontWeight: 600, fontSize: '0.9rem' }}>
              {job.title} at {job.company}
            </p>
          </div>
          <button className="close-btn" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        <div className="modal-body">
          {submittedApp ? (
            <div style={{ textAlign: 'center', padding: '30px 10px' }}>
              <CheckCircle2 size={56} color="#10b981" style={{ margin: '0 auto 16px auto' }} />
              <h3 style={{ fontSize: '1.4rem', fontWeight: 800, marginBottom: '8px' }}>
                Application Submitted!
              </h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', maxWidth: '440px', margin: '0 auto 20px auto' }}>
                Thank you, <strong>{submittedApp.applicantName}</strong>! Your application for{' '}
                <strong>{job.title}</strong> has been received by {job.company}.
              </p>
              <div
                style={{
                  background: '#f8fafc',
                  border: '1px dashed var(--surface-border)',
                  padding: '12px',
                  borderRadius: '8px',
                  display: 'inline-block',
                  fontSize: '0.85rem',
                  color: '#475569',
                  marginBottom: '24px',
                }}
              >
                Reference ID: <strong>{submittedApp._id}</strong>
              </div>
              <div>
                <button
                  className="search-btn"
                  onClick={onClose}
                  style={{ margin: '0 auto', padding: '10px 28px' }}
                >
                  Done & Back to Jobs
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit}>
              {error && (
                <div className="alert-toast alert-error">
                  <AlertCircle size={18} />
                  <span>{error}</span>
                </div>
              )}

              <div className="form-grid">
                <div className="form-group form-full">
                  <label>Full Legal Name *</label>
                  <input
                    type="text"
                    name="applicantName"
                    placeholder="e.g. Alex Morgan"
                    value={formData.applicantName}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Email Address *</label>
                  <input
                    type="email"
                    name="applicantEmail"
                    placeholder="alex@example.com"
                    value={formData.applicantEmail}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Phone Number *</label>
                  <input
                    type="tel"
                    name="phone"
                    placeholder="+1 (555) 000-0000"
                    value={formData.phone}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Years of Relevant Experience *</label>
                  <input
                    type="number"
                    name="experienceYears"
                    min="0"
                    max="40"
                    value={formData.experienceYears}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Resume Link / Cloud Storage URL *</label>
                  <input
                    type="url"
                    name="resumeLink"
                    placeholder="https://drive.google.com/... or LinkedIn URL"
                    value={formData.resumeLink}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="form-group form-full">
                  <label>Portfolio / GitHub Profile (Optional)</label>
                  <input
                    type="url"
                    name="portfolioUrl"
                    placeholder="https://github.com/... or https://portfolio.com"
                    value={formData.portfolioUrl}
                    onChange={handleChange}
                  />
                </div>

                <div className="form-group form-full">
                  <label>Cover Letter / Note to Recruiter (Optional)</label>
                  <textarea
                    name="coverLetter"
                    rows="4"
                    placeholder="Briefly describe why you are a great match for this role and your key accomplishments..."
                    value={formData.coverLetter}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div className="form-actions">
                <button type="button" className="btn-outline" onClick={onClose} disabled={loading}>
                  Cancel
                </button>
                <button type="submit" className="search-btn" disabled={loading}>
                  <Send size={16} />
                  {loading ? 'Submitting Application...' : 'Submit Application'}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}

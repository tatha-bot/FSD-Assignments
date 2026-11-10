import React from 'react';
import { X, MapPin, DollarSign, Briefcase, Users, Mail, CheckCircle2, Award, Calendar } from 'lucide-react';

export default function JobDetailsModal({ job, onClose, onApplyNow }) {
  if (!job) return null;

  const isClosed = job.status === 'Closed';

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-card" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div>
            <h2>{job.title}</h2>
            <p style={{ color: 'var(--primary)', fontWeight: 600, marginTop: '2px' }}>
              {job.company} • {job.location}
            </p>
          </div>
          <button className="close-btn" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        <div className="modal-body">
          {/* Key Info Banner */}
          <div
            style={{
              background: '#f8fafc',
              border: '1px solid var(--surface-border)',
              borderRadius: '12px',
              padding: '16px',
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
              gap: '12px',
              marginBottom: '24px',
            }}
          >
            <div>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block' }}>Job Type</span>
              <strong style={{ fontSize: '0.9rem' }}>{job.jobType}</strong>
            </div>
            <div>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block' }}>Category</span>
              <strong style={{ fontSize: '0.9rem' }}>{job.category}</strong>
            </div>
            <div>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block' }}>Experience</span>
              <strong style={{ fontSize: '0.9rem' }}>{job.experienceLevel}</strong>
            </div>
            <div>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block' }}>Compensation</span>
              <strong style={{ fontSize: '0.9rem' }}>{job.salary}</strong>
            </div>
            <div>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block' }}>Vacancies Open</span>
              <strong style={{ fontSize: '0.9rem', color: '#b45309' }}>
                🔥 {job.vacanciesCount} Seats
              </strong>
            </div>
          </div>

          {/* Description */}
          <div style={{ marginBottom: '22px' }}>
            <h4 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '8px', color: '#0f172a' }}>
              Job Overview & Responsibilities
            </h4>
            <p style={{ fontSize: '0.925rem', color: '#334155', lineHeight: 1.6, whiteSpace: 'pre-line' }}>
              {job.description}
            </p>
          </div>

          {/* Requirements */}
          {job.requirements && (
            <div style={{ marginBottom: '22px' }}>
              <h4 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '8px', color: '#0f172a' }}>
                Qualifications & Key Requirements
              </h4>
              <div style={{ fontSize: '0.925rem', color: '#334155', lineHeight: 1.6, whiteSpace: 'pre-line' }}>
                {job.requirements}
              </div>
            </div>
          )}

          {/* Benefits */}
          {job.benefits && (
            <div style={{ marginBottom: '22px' }}>
              <h4 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '8px', color: '#0f172a' }}>
                Benefits & Perks
              </h4>
              <div style={{ fontSize: '0.925rem', color: '#334155', lineHeight: 1.6, whiteSpace: 'pre-line' }}>
                {job.benefits}
              </div>
            </div>
          )}

          {/* Recruiter info */}
          <div
            style={{
              padding: '12px 16px',
              background: '#eff6ff',
              borderRadius: '8px',
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              fontSize: '0.875rem',
              color: '#1e40af',
              marginBottom: '24px',
            }}
          >
            <Mail size={16} />
            <span>
              Direct Recruiter Inquiries: <strong>{job.contactEmail}</strong>
            </span>
          </div>

          {/* Actions */}
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
            <button className="btn-outline" onClick={onClose} style={{ flex: 'none', padding: '10px 20px' }}>
              Close
            </button>
            {!isClosed && (
              <button
                className="btn-primary-apply"
                onClick={() => {
                  onClose();
                  onApplyNow(job);
                }}
                style={{ flex: 'none', padding: '10px 24px' }}
              >
                Apply for this Position
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

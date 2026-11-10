import React from 'react';
import { MapPin, DollarSign, Clock, Users, ArrowRight, Eye, CheckCircle2 } from 'lucide-react';

export default function JobCard({ job, onSelectDetails, onApplyNow }) {
  const isClosed = job.status === 'Closed';

  return (
    <div className={`job-card ${isClosed ? 'opacity-70' : ''}`}>
      <div>
        <div className="job-header">
          <div>
            <h3 className="job-title">{job.title}</h3>
            <p className="company-name">{job.company}</p>
          </div>

          <div className="vacancies-badge">
            <Users size={13} />
            <span>{job.vacanciesCount} {job.vacanciesCount === 1 ? 'Vacancy' : 'Vacancies'}</span>
          </div>
        </div>

        {/* Tags */}
        <div className="tags-row">
          <span className="tag tag-category">{job.category}</span>
          <span className={`tag ${job.jobType === 'Remote' ? 'tag-remote' : ''}`}>
            {job.jobType}
          </span>
          <span className="tag">{job.experienceLevel}</span>
          {job.status === 'Open' ? (
            <span className="tag" style={{ background: '#ecfdf5', color: '#047857' }}>
              ● Hiring Now
            </span>
          ) : (
            <span className="tag" style={{ background: '#fee2e2', color: '#b91c1c' }}>
              ● Closed
            </span>
          )}
        </div>

        {/* Meta */}
        <div className="job-meta-row">
          <div className="meta-item">
            <MapPin size={15} />
            <span>{job.location}</span>
          </div>
          <div className="meta-item">
            <DollarSign size={15} />
            <span>{job.salary}</span>
          </div>
        </div>

        {/* Description Excerpt */}
        <p className="job-description-excerpt">{job.description}</p>
      </div>

      {/* Action Buttons */}
      <div className="card-actions">
        <button
          className="btn-outline"
          onClick={() => onSelectDetails(job)}
        >
          <Eye size={15} style={{ display: 'inline', marginRight: '5px', verticalAlign: 'middle' }} />
          View Details
        </button>

        {isClosed ? (
          <button className="btn-closed" disabled>
            Closed
          </button>
        ) : (
          <button
            className="btn-primary-apply"
            onClick={() => onApplyNow(job)}
          >
            Apply Now
            <ArrowRight size={15} />
          </button>
        )}
      </div>
    </div>
  );
}

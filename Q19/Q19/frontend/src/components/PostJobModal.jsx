import React, { useState } from 'react';
import { X, PlusCircle, AlertCircle, CheckCircle } from 'lucide-react';
import { jobApi } from '../services/api';

export default function PostJobModal({ isOpen, onClose, onJobCreated }) {
  const [formData, setFormData] = useState({
    title: '',
    company: '',
    location: '',
    jobType: 'Full-time',
    category: 'Engineering',
    experienceLevel: 'Mid-level',
    salary: '$90,000 - $120,000',
    vacanciesCount: 1,
    description: '',
    requirements: '',
    benefits: '',
    contactEmail: '',
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!formData.title.trim() || !formData.company.trim() || !formData.location.trim() || !formData.description.trim()) {
      return setError('Please fill in all essential vacancy details (Title, Company, Location, Description).');
    }
    if (!formData.contactEmail.trim() || !formData.contactEmail.includes('@')) {
      return setError('Please provide a valid contact recruiter email.');
    }

    try {
      setLoading(true);
      const res = await jobApi.createJob(formData);
      onJobCreated(res.data);
      onClose();
    } catch (err) {
      setError(err.message || 'Failed to publish vacancy listing.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-card" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div>
            <h2>Post a New Vacancy</h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>
              Publish an open job position to candidates
            </p>
          </div>
          <button className="close-btn" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        <div className="modal-body">
          {error && (
            <div className="alert-toast alert-error">
              <AlertCircle size={18} />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="form-grid">
              <div className="form-group form-full">
                <label>Job Title *</label>
                <input
                  type="text"
                  name="title"
                  placeholder="e.g. Senior Frontend Engineer (React)"
                  value={formData.title}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label>Company / Organization *</label>
                <input
                  type="text"
                  name="company"
                  placeholder="e.g. Acme Corp"
                  value={formData.company}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label>Location *</label>
                <input
                  type="text"
                  name="location"
                  placeholder="e.g. San Francisco, CA or Remote"
                  value={formData.location}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label>Job Type *</label>
                <select name="jobType" value={formData.jobType} onChange={handleChange}>
                  <option value="Full-time">Full-time</option>
                  <option value="Part-time">Part-time</option>
                  <option value="Remote">Remote</option>
                  <option value="Contract">Contract</option>
                  <option value="Internship">Internship</option>
                </select>
              </div>

              <div className="form-group">
                <label>Category *</label>
                <select name="category" value={formData.category} onChange={handleChange}>
                  <option value="Engineering">Engineering</option>
                  <option value="Design">Design</option>
                  <option value="Marketing">Marketing</option>
                  <option value="Product">Product</option>
                  <option value="Sales">Sales</option>
                  <option value="Support">Support</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div className="form-group">
                <label>Vacancies Count (Seats) *</label>
                <input
                  type="number"
                  name="vacanciesCount"
                  min="1"
                  max="50"
                  value={formData.vacanciesCount}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label>Experience Level</label>
                <input
                  type="text"
                  name="experienceLevel"
                  placeholder="e.g. Senior (4+ yrs) or Entry-level"
                  value={formData.experienceLevel}
                  onChange={handleChange}
                />
              </div>

              <div className="form-group">
                <label>Salary / Compensation Range</label>
                <input
                  type="text"
                  name="salary"
                  placeholder="e.g. $110,000 - $140,000"
                  value={formData.salary}
                  onChange={handleChange}
                />
              </div>

              <div className="form-group">
                <label>Contact / Recruiter Email *</label>
                <input
                  type="email"
                  name="contactEmail"
                  placeholder="hr@company.com"
                  value={formData.contactEmail}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group form-full">
                <label>Job Description *</label>
                <textarea
                  name="description"
                  rows="4"
                  placeholder="Provide an overview of the role, day-to-day responsibilities, and team culture..."
                  value={formData.description}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group form-full">
                <label>Key Requirements (One per line)</label>
                <textarea
                  name="requirements"
                  rows="3"
                  placeholder="• 3+ years experience with React and Node.js&#10;• Experience designing REST APIs&#10;• Strong communication skills"
                  value={formData.requirements}
                  onChange={handleChange}
                />
              </div>

              <div className="form-group form-full">
                <label>Benefits & Perks (Optional)</label>
                <textarea
                  name="benefits"
                  rows="2"
                  placeholder="• Full healthcare insurance&#10;• Unlimited PTO&#10;• Annual learning stipend"
                  value={formData.benefits}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="form-actions">
              <button type="button" className="btn-outline" onClick={onClose} disabled={loading}>
                Cancel
              </button>
              <button type="submit" className="search-btn" disabled={loading}>
                <PlusCircle size={16} />
                {loading ? 'Publishing...' : 'Publish Vacancy Listing'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

const API_BASE = '/api';

export const jobApi = {
  // Fetch vacancies with optional search, category, type, location filters
  getJobs: async (filters = {}) => {
    const params = new URLSearchParams();
    if (filters.search) params.append('search', filters.search);
    if (filters.category && filters.category !== 'All') params.append('category', filters.category);
    if (filters.jobType && filters.jobType !== 'All') params.append('jobType', filters.jobType);
    if (filters.location) params.append('location', filters.location);
    if (filters.status) params.append('status', filters.status);

    const res = await fetch(`${API_BASE}/jobs?${params.toString()}`);
    if (!res.ok) throw new Error('Failed to fetch job vacancies');
    return res.json();
  },

  // Get job by ID
  getJobById: async (id) => {
    const res = await fetch(`${API_BASE}/jobs/${id}`);
    if (!res.ok) throw new Error('Failed to fetch job details');
    return res.json();
  },

  // Create a new vacancy listing
  createJob: async (jobData) => {
    const res = await fetch(`${API_BASE}/jobs`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(jobData),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Failed to post vacancy');
    return data;
  },

  // Update existing vacancy
  updateJob: async (id, updateData) => {
    const res = await fetch(`${API_BASE}/jobs/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updateData),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Failed to update job');
    return data;
  },

  // Delete vacancy
  deleteJob: async (id) => {
    const res = await fetch(`${API_BASE}/jobs/${id}`, {
      method: 'DELETE',
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Failed to delete vacancy');
    return data;
  },

  // Reset or seed sample vacancies
  seedJobs: async () => {
    const res = await fetch(`${API_BASE}/jobs/seed`, {
      method: 'POST',
    });
    if (!res.ok) throw new Error('Failed to seed vacancies');
    return res.json();
  },
};

export const applicationApi = {
  // Apply for a vacancy
  apply: async (formData) => {
    const res = await fetch(`${API_BASE}/applications`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Failed to submit application');
    return data;
  },

  // Get applications for recruiter/admin
  getApplications: async (jobId = null) => {
    const url = jobId ? `${API_BASE}/applications?jobId=${jobId}` : `${API_BASE}/applications`;
    const res = await fetch(url);
    if (!res.ok) throw new Error('Failed to fetch applications');
    return res.json();
  },

  // Update status (Pending, Reviewed, Shortlisted, Interview, Hired, Rejected)
  updateStatus: async (applicationId, status) => {
    const res = await fetch(`${API_BASE}/applications/${applicationId}/status`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Failed to update application status');
    return data;
  },
};

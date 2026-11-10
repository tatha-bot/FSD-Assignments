const API_BASE = '/api';

export const employeeApi = {
  // Get all employees with optional search, department filter, and sort
  getEmployees: async ({ q = '', department = 'All', sort = 'newest' } = {}) => {
    const params = new URLSearchParams();
    if (q) params.append('q', q);
    if (department && department !== 'All') params.append('department', department);
    if (sort) params.append('sort', sort);

    const res = await fetch(`${API_BASE}/employees?${params.toString()}`);
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to fetch employees');
    return data;
  },

  // Get single employee
  getEmployeeById: async (id) => {
    const res = await fetch(`${API_BASE}/employees/${id}`);
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to fetch employee details');
    return data;
  },

  // Create new employee
  createEmployee: async (employeeData) => {
    const res = await fetch(`${API_BASE}/employees`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(employeeData),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to create employee');
    return data;
  },

  // Update employee
  updateEmployee: async (id, updateData) => {
    const res = await fetch(`${API_BASE}/employees/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updateData),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to update employee');
    return data;
  },

  // Delete employee
  deleteEmployee: async (id) => {
    const res = await fetch(`${API_BASE}/employees/${id}`, {
      method: 'DELETE',
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to delete employee');
    return data;
  },

  // Get department & salary stats
  getStats: async () => {
    const res = await fetch(`${API_BASE}/employees/stats`);
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to fetch stats');
    return data;
  },

  // Reset demo data
  resetDemo: async () => {
    const res = await fetch(`${API_BASE}/employees/seed`, {
      method: 'POST',
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to reset demo data');
    return data;
  }
};

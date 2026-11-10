const BASE_URL = '/api';

export const api = {
  // Stats
  async getStats() {
    const res = await fetch(`${BASE_URL}/stats`);
    if (!res.ok) throw new Error('Failed to fetch stats');
    return res.json();
  },

  // Employees
  async getEmployees(params = {}) {
    const query = new URLSearchParams();
    if (params.q) query.set('q', params.q);
    if (params.department) query.set('department', params.department);
    if (params.status) query.set('status', params.status);
    const res = await fetch(`${BASE_URL}/employees?${query.toString()}`);
    if (!res.ok) throw new Error('Failed to fetch employees');
    return res.json();
  },

  async getEmployeeById(id) {
    const res = await fetch(`${BASE_URL}/employees/${id}`);
    if (!res.ok) throw new Error('Failed to fetch employee');
    return res.json();
  },

  async createEmployee(data) {
    const res = await fetch(`${BASE_URL}/employees`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    const json = await res.json();
    if (!res.ok) throw new Error(json.error || 'Failed to create employee');
    return json;
  },

  async updateEmployee(id, data) {
    const res = await fetch(`${BASE_URL}/employees/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    const json = await res.json();
    if (!res.ok) throw new Error(json.error || 'Failed to update employee');
    return json;
  },

  async deleteEmployee(id) {
    const res = await fetch(`${BASE_URL}/employees/${id}`, {
      method: 'DELETE'
    });
    const json = await res.json();
    if (!res.ok) throw new Error(json.error || 'Failed to delete employee');
    return json;
  },

  // Attendance
  async getAttendance(params = {}) {
    const query = new URLSearchParams();
    if (params.date) query.set('date', params.date);
    if (params.empId) query.set('empId', params.empId);
    if (params.department) query.set('department', params.department);
    const res = await fetch(`${BASE_URL}/attendance?${query.toString()}`);
    if (!res.ok) throw new Error('Failed to fetch attendance');
    return res.json();
  },

  async markAttendance(data) {
    const res = await fetch(`${BASE_URL}/attendance`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    const json = await res.json();
    if (!res.ok) throw new Error(json.error || 'Failed to mark attendance');
    return json;
  },

  async bulkMarkAttendance(payload) {
    const res = await fetch(`${BASE_URL}/attendance/bulk`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    const json = await res.json();
    if (!res.ok) throw new Error(json.error || 'Failed to save bulk attendance');
    return json;
  },

  // Salary
  async calculateWage(payload) {
    const res = await fetch(`${BASE_URL}/salary/calculate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    const json = await res.json();
    if (!res.ok) throw new Error(json.error || 'Failed to calculate wage');
    return json;
  },

  async disburseSalary(payload) {
    const res = await fetch(`${BASE_URL}/salary/pay`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    const json = await res.json();
    if (!res.ok) throw new Error(json.error || 'Failed to disburse salary');
    return json;
  },

  async batchDisburseSalary(payload) {
    const res = await fetch(`${BASE_URL}/salary/batch-disburse`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    const json = await res.json();
    if (!res.ok) throw new Error(json.error || 'Failed to batch disburse');
    return json;
  },

  async getPayments(params = {}) {
    const query = new URLSearchParams();
    if (params.empId) query.set('empId', params.empId);
    if (params.paymentStatus) query.set('paymentStatus', params.paymentStatus);
    if (params.department) query.set('department', params.department);
    if (params.startDate) query.set('startDate', params.startDate);
    if (params.endDate) query.set('endDate', params.endDate);
    const res = await fetch(`${BASE_URL}/salary/payments?${query.toString()}`);
    if (!res.ok) throw new Error('Failed to fetch payments');
    return res.json();
  },

  async getPaymentById(id) {
    const res = await fetch(`${BASE_URL}/salary/payments/${id}`);
    if (!res.ok) throw new Error('Failed to fetch payment details');
    return res.json();
  }
};

const seedEmployees = require("./seedEmployees");

let employees = seedEmployees.map((emp, idx) => ({
  _id: `emp_${idx + 1}`,
  ...emp,
  createdAt: new Date(Date.now() - (idx * 86400000 * 5)).toISOString(),
  updatedAt: new Date().toISOString()
}));

const memoryStore = {
  getEmployees: ({ q, department, sort }) => {
    let list = [...employees];

    if (q) {
      const term = q.toLowerCase();
      list = list.filter(emp =>
        emp.firstName.toLowerCase().includes(term) ||
        emp.lastName.toLowerCase().includes(term) ||
        emp.email.toLowerCase().includes(term) ||
        emp.position.toLowerCase().includes(term) ||
        emp.department.toLowerCase().includes(term)
      );
    }

    if (department && department !== 'All') {
      list = list.filter(emp => emp.department.toLowerCase() === department.toLowerCase());
    }

    if (sort === 'salary_desc') {
      list.sort((a, b) => b.salary - a.salary);
    } else if (sort === 'salary_asc') {
      list.sort((a, b) => a.salary - b.salary);
    } else if (sort === 'name_asc') {
      list.sort((a, b) => a.firstName.localeCompare(b.firstName));
    } else if (sort === 'name_desc') {
      list.sort((a, b) => b.firstName.localeCompare(a.firstName));
    } else {
      // newest first
      list.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    }

    return list;
  },

  getEmployeeById: (id) => {
    return employees.find(emp => String(emp._id) === String(id)) || null;
  },

  createEmployee: (data) => {
    // Check duplicate email
    const exists = employees.find(e => e.email.toLowerCase() === data.email.toLowerCase());
    if (exists) {
      throw new Error(`Employee with email ${data.email} already exists`);
    }

    const newEmp = {
      _id: `emp_${Date.now()}`,
      firstName: data.firstName.trim(),
      lastName: data.lastName.trim(),
      email: data.email.toLowerCase().trim(),
      department: data.department,
      position: data.position.trim(),
      salary: Number(data.salary) || 50000,
      phone: data.phone || "",
      hireDate: data.hireDate ? new Date(data.hireDate).toISOString() : new Date().toISOString(),
      status: data.status || "Active",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    employees.unshift(newEmp);
    return newEmp;
  },

  updateEmployee: (id, updateData) => {
    const idx = employees.findIndex(emp => String(emp._id) === String(id));
    if (idx === -1) return null;

    if (updateData.email) {
      const emailConflict = employees.find(
        e => e.email.toLowerCase() === updateData.email.toLowerCase() && String(e._id) !== String(id)
      );
      if (emailConflict) {
        throw new Error(`Email ${updateData.email} is already in use by another employee`);
      }
    }

    employees[idx] = {
      ...employees[idx],
      ...updateData,
      salary: updateData.salary !== undefined ? Number(updateData.salary) : employees[idx].salary,
      updatedAt: new Date().toISOString()
    };

    return employees[idx];
  },

  deleteEmployee: (id) => {
    const idx = employees.findIndex(emp => String(emp._id) === String(id));
    if (idx === -1) return false;
    employees.splice(idx, 1);
    return true;
  },

  getStats: () => {
    const total = employees.length;
    if (total === 0) {
      return { total: 0, avgSalary: 0, activeCount: 0, departmentBreakdown: {} };
    }
    const sumSalary = employees.reduce((sum, e) => sum + (Number(e.salary) || 0), 0);
    const avgSalary = Math.round(sumSalary / total);
    const activeCount = employees.filter(e => e.status === "Active").length;

    const departmentBreakdown = {};
    employees.forEach(e => {
      departmentBreakdown[e.department] = (departmentBreakdown[e.department] || 0) + 1;
    });

    return {
      total,
      avgSalary,
      activeCount,
      departmentBreakdown
    };
  },

  resetDemo: () => {
    employees = seedEmployees.map((emp, idx) => ({
      _id: `emp_${idx + 1}`,
      ...emp,
      createdAt: new Date(Date.now() - (idx * 86400000 * 5)).toISOString(),
      updatedAt: new Date().toISOString()
    }));
    return employees;
  }
};

module.exports = memoryStore;

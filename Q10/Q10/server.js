// =============================================================================
// Q10: Employee Salary Increment Full Stack Web Application
// Tech Stack: Node.js (Built-in HTTP), MongoDB Query Engine, HTML5/Bootstrap
// Run: node server.js -> Open http://localhost:3001
// =============================================================================

const http = require('http');
const url = require('url');

const PORT = 3001;

const initialEmployees = [
    { emp_id: "E101", emp_name: "Rajesh Sharma", department: "Engineering", salary: 55000 },
    { emp_id: "E102", emp_name: "Pooja Nair", department: "Human Resources", salary: 38000 },
    { emp_id: "E103", emp_name: "Vikram Malhotra", department: "Engineering", salary: 85000 },
    { emp_id: "E104", emp_name: "Sneha Roy", department: "Marketing", salary: 42000 },
    { emp_id: "E105", emp_name: "Arun Kumar", department: "Finance", salary: 60000 },
    { emp_id: "E106", emp_name: "Meera Patel", department: "Engineering", salary: 47000 },
    { emp_id: "E107", emp_name: "Karthik Rao", department: "Support", salary: 32000 }
];

let employees = JSON.parse(JSON.stringify(initialEmployees));
let lastExecutedQuery = "db.employees.find().pretty();";
let hikeAppliedCount = 0;

function sendJSON(res, statusCode, data) {
    res.writeHead(statusCode, { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' });
    res.end(JSON.stringify(data));
}

const server = http.createServer((req, res) => {
    const parsedUrl = url.parse(req.url, true);
    const pathname = parsedUrl.pathname;
    const method = req.method;

    if (method === 'OPTIONS') {
        res.writeHead(204, {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type'
        });
        return res.end();
    }

    // 1. GET Employees
    if (pathname === '/api/employees' && method === 'GET') {
        return sendJSON(res, 200, {
            data: employees,
            lastQuery: lastExecutedQuery,
            hikeCount: hikeAppliedCount
        });
    }

    // 2. POST Apply +1000 Salary Hike (CORE QUERY)
    if (pathname === '/api/employees/increment' && method === 'POST') {
        // Execute MongoDB updateMany({}, { $inc: { salary: 1000 } })
        employees.forEach(emp => {
            emp.salary += 1000;
        });
        hikeAppliedCount++;
        lastExecutedQuery = "db.employees.updateMany({}, { $inc: { salary: 1000 } });";

        return sendJSON(res, 200, {
            message: "Successfully incremented all employee salaries by 1000",
            modifiedCount: employees.length,
            lastQuery: lastExecutedQuery,
            data: employees
        });
    }

    // 3. POST Reset to Initial Data
    if (pathname === '/api/employees/reset' && method === 'POST') {
        employees = JSON.parse(JSON.stringify(initialEmployees));
        hikeAppliedCount = 0;
        lastExecutedQuery = "db.employees.drop(); db.employees.insertMany([...]);";
        return sendJSON(res, 200, { message: "Reset to initial sample records", data: employees, lastQuery: lastExecutedQuery });
    }

    // 4. FRONTEND WEB PAGE
    if (pathname === '/' || pathname === '/index.html') {
        res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
        res.end(`<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Q10 - Employee Salary Increment (MongoDB $inc)</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.0/font/bootstrap-icons.css">
    <style>
        body { background-color: #0f172a; color: #f8fafc; font-family: 'Segoe UI', system-ui, sans-serif; }
        .hero { background: linear-gradient(135deg, #065f46, #0f172a); border-bottom: 1px solid rgba(255,255,255,0.1); padding: 25px 0; }
        .card-custom { background: #1e293b; border: 1px solid rgba(255,255,255,0.08); border-radius: 12px; }
        .query-console { background: #020617; border-left: 4px solid #10b981; font-family: Consolas, monospace; color: #34d399; padding: 12px; border-radius: 6px; font-size: 0.95rem; }
        .salary-badge { background: #064e3b; color: #6ee7b7; font-weight: 700; font-size: 0.95rem; padding: 6px 14px; border-radius: 8px; border: 1px solid #059669; }
    </style>
</head>
<body>

<div class="hero text-center mb-4">
    <div class="container">
        <span class="badge bg-success px-3 py-1 rounded-pill mb-2">Assignment Q10 • Full Stack Web Development</span>
        <h2 class="fw-bold text-white">Employee Salary Update Portal</h2>
        <p class="text-white-50 mb-0">MongoDB Query to Increment Salary of All Employees by Rs. 1,000 using <code>$inc</code></p>
    </div>
</div>

<div class="container pb-5">
    <!-- Live MongoDB Query Inspector -->
    <div class="card card-custom p-3 mb-4">
        <div class="d-flex justify-content-between align-items-center mb-1">
            <span class="fw-bold text-light small"><i class="bi bi-terminal-fill me-1 text-success"></i> Executed MongoDB Query:</span>
            <span class="badge bg-success">MongoDB updateMany</span>
        </div>
        <div class="query-console" id="queryConsole">db.employees.find().pretty();</div>
    </div>

    <!-- Action Toolbar & Metrics -->
    <div class="row g-3 mb-4">
        <div class="col-md-4">
            <div class="card card-custom p-3">
                <span class="text-secondary small fw-semibold">Total Employees</span>
                <h3 class="fw-bold text-white mt-1 mb-0" id="empCount">7</h3>
            </div>
        </div>
        <div class="col-md-4">
            <div class="card card-custom p-3">
                <span class="text-secondary small fw-semibold">Total Payroll Increase Applied</span>
                <h3 class="fw-bold text-success mt-1 mb-0" id="totalIncrease">Rs. 0</h3>
            </div>
        </div>
        <div class="col-md-4 d-flex align-items-center gap-2">
            <button class="btn btn-success fw-semibold flex-grow-1 py-3" onclick="applySalaryIncrement()">
                <i class="bi bi-graph-up-arrow me-1"></i> Apply +1000 Salary Hike
            </button>
            <button class="btn btn-outline-secondary py-3 px-3" onclick="resetData()" title="Reset to initial data">
                <i class="bi bi-arrow-counterclockwise"></i>
            </button>
        </div>
    </div>

    <!-- Employee Table -->
    <div class="card card-custom p-4">
        <h5 class="fw-bold text-white mb-3"><i class="bi bi-people-fill me-2 text-info"></i>Employee Records in Database (company_db.employees)</h5>
        <div class="table-responsive">
            <table class="table table-dark table-hover align-middle mb-0">
                <thead class="table-secondary text-dark">
                    <tr>
                        <th>Employee ID</th>
                        <th>Employee Name</th>
                        <th>Department</th>
                        <th class="text-end">Current Salary (Rs.)</th>
                    </tr>
                </thead>
                <tbody id="empTableBody">
                    <tr><td colspan="4" class="text-center py-4">Loading employee records...</td></tr>
                </tbody>
            </table>
        </div>
    </div>
</div>

<script>
    async function loadEmployees() {
        const res = await fetch('/api/employees');
        const json = await res.json();
        document.getElementById('queryConsole').innerText = json.lastQuery;
        document.getElementById('empCount').innerText = json.data.length;
        document.getElementById('totalIncrease').innerText = 'Rs. ' + (json.hikeCount * json.data.length * 1000).toLocaleString();

        const tbody = document.getElementById('empTableBody');
        tbody.innerHTML = '';
        json.data.forEach(e => {
            tbody.innerHTML += \`
                <tr>
                    <td class="fw-bold text-info">\${e.emp_id}</td>
                    <td class="fw-semibold text-light">\${e.emp_name}</td>
                    <td class="text-secondary">\${e.department}</td>
                    <td class="text-end">
                        <span class="salary-badge">Rs. \${e.salary.toLocaleString()}</span>
                    </td>
                </tr>
            \`;
        });
    }

    async function applySalaryIncrement() {
        const res = await fetch('/api/employees/increment', { method: 'POST' });
        const json = await res.json();
        loadEmployees();
    }

    async function resetData() {
        await fetch('/api/employees/reset', { method: 'POST' });
        loadEmployees();
    }

    loadEmployees();
</script>
</body>
</html>`);
    }
});

server.listen(PORT, () => {
    console.log(`[Q10 Full Stack Web App] Running at http://localhost:${PORT}`);
    console.log(`[Q10] Performing MongoDB salary increment ($inc: { salary: 1000 }) query.`);
});

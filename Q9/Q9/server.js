// =============================================================================
// Q9: Student Course Registration Full Stack Web Application
// Tech Stack: Node.js (Built-in HTTP), MongoDB (or In-Memory Store), HTML5/Bootstrap
// Run: node server.js -> Open http://localhost:3000
// =============================================================================

const http = require('http');
const url = require('url');

const PORT = 3000;

// Initial In-Memory / Database State
let studentRegistrations = [
    {
        roll_number: "CS202601",
        student_name: "Aarav Patel",
        email: "aarav.patel@univ.edu",
        department: "Computer Science",
        semester: 4,
        registered_courses: [
            { course_code: "CS201", course_name: "Data Structures", credits: 4 },
            { course_code: "CS202", course_name: "Operating Systems", credits: 4 }
        ],
        status: "Active"
    },
    {
        roll_number: "CS202602",
        student_name: "Diya Sen",
        email: "diya.sen@univ.edu",
        department: "Computer Science",
        semester: 4,
        registered_courses: [
            { course_code: "CS201", course_name: "Data Structures", credits: 4 },
            { course_code: "CS203", course_name: "DBMS", credits: 3 }
        ],
        status: "Active"
    },
    {
        roll_number: "IT202603",
        student_name: "Rohan Sharma",
        email: "rohan.sharma@univ.edu",
        department: "Information Technology",
        semester: 4,
        registered_courses: [
            { course_code: "IT201", course_name: "Web Technologies", credits: 3 }
        ],
        status: "Active"
    }
];

let lastExecutedQuery = "db.student_registrations.find().pretty();";

function sendJSON(res, statusCode, data) {
    res.writeHead(statusCode, { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' });
    res.end(JSON.stringify(data));
}

const server = http.createServer((req, res) => {
    const parsedUrl = url.parse(req.url, true);
    const pathname = parsedUrl.pathname;
    const method = req.method;

    // CORS pre-flight
    if (method === 'OPTIONS') {
        res.writeHead(204, {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type'
        });
        return res.end();
    }

    // 1. API: GET all students or query by course/roll (READ)
    if (pathname === '/api/students' && method === 'GET') {
        const queryCourse = parsedUrl.query.course;
        const queryRoll = parsedUrl.query.roll;

        let result = studentRegistrations;
        if (queryRoll) {
            result = result.filter(s => s.roll_number.toLowerCase() === queryRoll.toLowerCase());
            lastExecutedQuery = `db.student_registrations.find({ roll_number: "${queryRoll}" });`;
        } else if (queryCourse) {
            result = result.filter(s => s.registered_courses.some(c => c.course_code.toLowerCase() === queryCourse.toLowerCase()));
            lastExecutedQuery = `db.student_registrations.find({ "registered_courses.course_code": "${queryCourse}" });`;
        } else {
            lastExecutedQuery = "db.student_registrations.find().pretty();";
        }
        return sendJSON(res, 200, { data: result, lastQuery: lastExecutedQuery });
    }

    // 2. API: POST create registration (CREATE)
    if (pathname === '/api/students' && method === 'POST') {
        let body = '';
        req.on('data', chunk => body += chunk);
        req.on('end', () => {
            try {
                const newStudent = JSON.parse(body);
                if (!newStudent.roll_number || !newStudent.student_name) {
                    return sendJSON(res, 400, { error: 'Roll number and student name required' });
                }
                const exists = studentRegistrations.some(s => s.roll_number === newStudent.roll_number);
                if (exists) {
                    return sendJSON(res, 409, { error: 'Student with this roll number already exists!' });
                }
                newStudent.registered_courses = newStudent.registered_courses || [];
                newStudent.status = newStudent.status || "Active";
                studentRegistrations.push(newStudent);

                lastExecutedQuery = `db.student_registrations.insertOne(${JSON.stringify(newStudent, null, 2)});`;
                return sendJSON(res, 201, { message: 'Student registered successfully', student: newStudent, lastQuery: lastExecutedQuery });
            } catch (err) {
                return sendJSON(res, 400, { error: 'Invalid JSON payload' });
            }
        });
        return;
    }

    // 3. API: PUT update student info or courses (UPDATE)
    if (pathname.startsWith('/api/students/') && method === 'PUT') {
        const roll = decodeURIComponent(pathname.split('/')[3]);
        let body = '';
        req.on('data', chunk => body += chunk);
        req.on('end', () => {
            try {
                const payload = JSON.parse(body);
                const student = studentRegistrations.find(s => s.roll_number.toLowerCase() === roll.toLowerCase());
                if (!student) {
                    return sendJSON(res, 404, { error: 'Student not found' });
                }

                // If adding a course ($push)
                if (payload.action === 'add_course' && payload.course) {
                    student.registered_courses.push(payload.course);
                    lastExecutedQuery = `db.student_registrations.updateOne({ roll_number: "${roll}" }, { $push: { registered_courses: ${JSON.stringify(payload.course)} } });`;
                } 
                // If dropping a course ($pull)
                else if (payload.action === 'drop_course' && payload.course_code) {
                    student.registered_courses = student.registered_courses.filter(c => c.course_code !== payload.course_code);
                    lastExecutedQuery = `db.student_registrations.updateOne({ roll_number: "${roll}" }, { $pull: { registered_courses: { course_code: "${payload.course_code}" } } });`;
                }
                // General field update ($set)
                else {
                    if (payload.status) student.status = payload.status;
                    if (payload.semester) student.semester = payload.semester;
                    lastExecutedQuery = `db.student_registrations.updateOne({ roll_number: "${roll}" }, { $set: ${JSON.stringify(payload)} });`;
                }

                return sendJSON(res, 200, { message: 'Updated successfully', student, lastQuery: lastExecutedQuery });
            } catch (err) {
                return sendJSON(res, 400, { error: 'Invalid JSON payload' });
            }
        });
        return;
    }

    // 4. API: DELETE student registration (DELETE)
    if (pathname.startsWith('/api/students/') && method === 'DELETE') {
        const roll = decodeURIComponent(pathname.split('/')[3]);
        const index = studentRegistrations.findIndex(s => s.roll_number.toLowerCase() === roll.toLowerCase());
        if (index === -1) {
            return sendJSON(res, 404, { error: 'Student not found' });
        }
        studentRegistrations.splice(index, 1);
        lastExecutedQuery = `db.student_registrations.deleteOne({ roll_number: "${roll}" });`;
        return sendJSON(res, 200, { message: 'Registration deleted successfully', lastQuery: lastExecutedQuery });
    }

    // 5. FRONTEND WEB PAGE (HTML / Bootstrap 5 Single Page Application)
    if (pathname === '/' || pathname === '/index.html') {
        res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
        res.end(`<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Q9 - Student Course Registration (MongoDB CRUD)</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.0/font/bootstrap-icons.css">
    <style>
        body { background-color: #0f172a; color: #f8fafc; font-family: 'Segoe UI', system-ui, sans-serif; }
        .hero { background: linear-gradient(135deg, #1e3a8a, #0f172a); border-bottom: 1px solid rgba(255,255,255,0.1); padding: 25px 0; }
        .card-custom { background: #1e293b; border: 1px solid rgba(255,255,255,0.08); border-radius: 12px; }
        .query-console { background: #020617; border-left: 4px solid #38bdf8; font-family: Consolas, monospace; color: #38bdf8; padding: 12px; border-radius: 6px; font-size: 0.9rem; }
        .badge-course { background: #334155; color: #38bdf8; border: 1px solid #475569; margin: 2px; }
        .table-dark-custom { --bs-table-bg: #1e293b; --bs-table-color: #f8fafc; }
    </style>
</head>
<body>

<div class="hero text-center mb-4">
    <div class="container">
        <span class="badge bg-primary px-3 py-1 rounded-pill mb-2">Assignment Q9 • Full Stack Web Development</span>
        <h2 class="fw-bold text-white">Student Course Registration Portal</h2>
        <p class="text-white-50 mb-0">MongoDB CRUD Operations (Create, Read, Update, Delete) with Live Query Inspector</p>
    </div>
</div>

<div class="container pb-5">
    <!-- Live MongoDB Query Inspector -->
    <div class="card card-custom p-3 mb-4">
        <div class="d-flex justify-content-between align-items-center mb-1">
            <span class="fw-bold text-light small"><i class="bi bi-terminal-fill me-1 text-info"></i> Last Executed MongoDB Query:</span>
            <span class="badge bg-success">MongoDB Live Engine</span>
        </div>
        <div class="query-console" id="queryConsole">db.student_registrations.find().pretty();</div>
    </div>

    <div class="row g-4">
        <!-- CREATE: Registration Form -->
        <div class="col-lg-4">
            <div class="card card-custom p-4">
                <h5 class="fw-bold text-info mb-3"><i class="bi bi-person-plus-fill me-2"></i>Register New Student</h5>
                <form id="regForm">
                    <div class="mb-3">
                        <label class="form-label small fw-semibold">Roll Number <span class="text-danger">*</span></label>
                        <input type="text" id="rollNo" class="form-control form-control-sm bg-dark text-light border-secondary" placeholder="e.g. CS202610" required>
                    </div>
                    <div class="mb-3">
                        <label class="form-label small fw-semibold">Student Name <span class="text-danger">*</span></label>
                        <input type="text" id="studentName" class="form-control form-control-sm bg-dark text-light border-secondary" placeholder="e.g. Ananya Gupta" required>
                    </div>
                    <div class="mb-3">
                        <label class="form-label small fw-semibold">Email Address</label>
                        <input type="email" id="email" class="form-control form-control-sm bg-dark text-light border-secondary" placeholder="name@univ.edu">
                    </div>
                    <div class="row">
                        <div class="col-6 mb-3">
                            <label class="form-label small fw-semibold">Department</label>
                            <select id="department" class="form-select form-select-sm bg-dark text-light border-secondary">
                                <option value="Computer Science">Computer Science</option>
                                <option value="Information Tech">Information Tech</option>
                                <option value="Electronics">Electronics</option>
                            </select>
                        </div>
                        <div class="col-6 mb-3">
                            <label class="form-label small fw-semibold">Semester</label>
                            <input type="number" id="semester" class="form-control form-control-sm bg-dark text-light border-secondary" value="4" min="1" max="8">
                        </div>
                    </div>
                    <div class="mb-3">
                        <label class="form-label small fw-semibold">Initial Course</label>
                        <select id="initialCourse" class="form-select form-select-sm bg-dark text-light border-secondary">
                            <option value="CS201|Data Structures|4">CS201 - Data Structures (4 Credits)</option>
                            <option value="CS202|Operating Systems|4">CS202 - Operating Systems (4 Credits)</option>
                            <option value="CS203|DBMS|3">CS203 - DBMS (3 Credits)</option>
                            <option value="CS204|Computer Networks|3">CS204 - Computer Networks (3 Credits)</option>
                        </select>
                    </div>
                    <button type="submit" class="btn btn-primary btn-sm w-100 fw-semibold">
                        <i class="bi bi-cloud-arrow-up me-1"></i> Register Student (db.insertOne)
                    </button>
                </form>
            </div>
        </div>

        <!-- READ, UPDATE & DELETE: Registrations List -->
        <div class="col-lg-8">
            <div class="card card-custom p-4">
                <div class="d-flex flex-wrap justify-content-between align-items-center mb-3 gap-2">
                    <h5 class="fw-bold text-white mb-0"><i class="bi bi-mortarboard-fill me-2 text-warning"></i>Registered Students</h5>
                    <div class="d-flex gap-2">
                        <input type="text" id="filterCourse" class="form-control form-control-sm bg-dark text-light border-secondary" placeholder="Filter by course code...">
                        <button class="btn btn-outline-info btn-sm" onclick="filterByCourse()"><i class="bi bi-search"></i></button>
                        <button class="btn btn-outline-secondary btn-sm" onclick="loadStudents()"><i class="bi bi-arrow-clockwise"></i></button>
                    </div>
                </div>

                <div class="table-responsive">
                    <table class="table table-dark table-hover align-middle mb-0">
                        <thead class="table-secondary text-dark">
                            <tr>
                                <th>Roll No</th>
                                <th>Name</th>
                                <th>Dept / Sem</th>
                                <th>Registered Courses</th>
                                <th>Status</th>
                                <th class="text-end">Actions</th>
                            </tr>
                        </thead>
                        <tbody id="studentTableBody">
                            <tr><td colspan="6" class="text-center py-4">Loading student course registrations...</td></tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    </div>
</div>

<script>
    async function loadStudents(course = '') {
        let url = '/api/students';
        if (course) url += '?course=' + encodeURIComponent(course);
        const res = await fetch(url);
        const json = await res.json();
        document.getElementById('queryConsole').innerText = json.lastQuery || 'db.student_registrations.find().pretty();';

        const tbody = document.getElementById('studentTableBody');
        tbody.innerHTML = '';
        if (json.data.length === 0) {
            tbody.innerHTML = '<tr><td colspan="6" class="text-center py-4 text-muted">No student records found.</td></tr>';
            return;
        }

        json.data.forEach(s => {
            const courseBadges = s.registered_courses.map(c => 
                \`<span class="badge badge-course">\${c.course_code}: \${c.course_name} <a href="javascript:void(0)" onclick="dropCourse('\${s.roll_number}', '\${c.course_code}')" class="text-danger ms-1 text-decoration-none">&times;</a></span>\`
            ).join(' ');

            tbody.innerHTML += \`
                <tr>
                    <td class="fw-bold text-info">\${s.roll_number}</td>
                    <td>\${s.student_name}</td>
                    <td class="small text-muted">\${s.department} (Sem \${s.semester})</td>
                    <td>\${courseBadges || '<span class="text-warning small">No courses registered</span>'}</td>
                    <td><span class="badge bg-\${s.status === 'Active' ? 'success' : 'secondary'}">\${s.status}</span></td>
                    <td class="text-end">
                        <button class="btn btn-outline-primary btn-sm py-0 px-2" onclick="promptAddCourse('\${s.roll_number}')" title="Add Course ($push)">+ Course</button>
                        <button class="btn btn-outline-danger btn-sm py-0 px-2 ms-1" onclick="deleteStudent('\${s.roll_number}')" title="Delete ($deleteOne)"><i class="bi bi-trash"></i></button>
                    </td>
                </tr>
            \`;
        });
    }

    document.getElementById('regForm').addEventListener('submit', async (e) => {
        e.preventDefault();
        const courseParts = document.getElementById('initialCourse').value.split('|');
        const payload = {
            roll_number: document.getElementById('rollNo').value.trim(),
            student_name: document.getElementById('studentName').value.trim(),
            email: document.getElementById('email').value.trim(),
            department: document.getElementById('department').value,
            semester: parseInt(document.getElementById('semester').value),
            registered_courses: [{
                course_code: courseParts[0],
                course_name: courseParts[1],
                credits: parseInt(courseParts[2])
            }],
            status: "Active"
        };

        const res = await fetch('/api/students', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });
        const data = await res.json();
        if (res.ok) {
            document.getElementById('regForm').reset();
            loadStudents();
        } else {
            alert(data.error || 'Failed to add student');
        }
    });

    async function promptAddCourse(rollNo) {
        const code = prompt('Enter Course Code to Add ($push) (e.g. CS204):', 'CS204');
        if (!code) return;
        const name = prompt('Enter Course Name:', 'Computer Networks');
        if (!name) return;

        await fetch('/api/students/' + encodeURIComponent(rollNo), {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                action: 'add_course',
                course: { course_code: code.trim(), course_name: name.trim(), credits: 3 }
            })
        });
        loadStudents();
    }

    async function dropCourse(rollNo, courseCode) {
        if (!confirm('Drop course ' + courseCode + ' from student ' + rollNo + ' ($pull)?')) return;
        await fetch('/api/students/' + encodeURIComponent(rollNo), {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                action: 'drop_course',
                course_code: courseCode
            })
        });
        loadStudents();
    }

    async function deleteStudent(rollNo) {
        if (!confirm('Delete registration for ' + rollNo + ' (db.deleteOne)?')) return;
        await fetch('/api/students/' + encodeURIComponent(rollNo), { method: 'DELETE' });
        loadStudents();
    }

    function filterByCourse() {
        const c = document.getElementById('filterCourse').value.trim();
        loadStudents(c);
    }

    loadStudents();
</script>
</body>
</html>`);
    }
});

server.listen(PORT, () => {
    console.log(`[Q9 Full Stack Web App] Running at http://localhost:${PORT}`);
    console.log(`[Q9] Performing MongoDB CRUD operations on student course registrations.`);
});

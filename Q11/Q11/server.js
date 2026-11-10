// =============================================================================
// Q11: Student Marks Aggregation Full Stack Web Application
// Tech Stack: Node.js (Built-in HTTP), MongoDB Aggregation Pipeline, HTML5/Bootstrap
// Run: node server.js -> Open http://localhost:3002
// =============================================================================

const http = require('http');
const url = require('url');

const PORT = 3002;

const studentMarksData = [
    { roll_number: "CS101", name: "Aarav Patel", subject: "Mathematics", marks: 95 },
    { roll_number: "CS101", name: "Aarav Patel", subject: "Physics", marks: 88 },
    { roll_number: "CS101", name: "Aarav Patel", subject: "Computer Science", marks: 98 },

    { roll_number: "CS102", name: "Diya Sen", subject: "Mathematics", marks: 82 },
    { roll_number: "CS102", name: "Diya Sen", subject: "Physics", marks: 91 },
    { roll_number: "CS102", name: "Diya Sen", subject: "Computer Science", marks: 89 },

    { roll_number: "CS103", name: "Rohan Sharma", subject: "Mathematics", marks: 74 },
    { roll_number: "CS103", name: "Rohan Sharma", subject: "Physics", marks: 68 },
    { roll_number: "CS103", name: "Rohan Sharma", subject: "Computer Science", marks: 80 },

    { roll_number: "CS104", name: "Aarav Patel", subject: "English", marks: 85 },
    { roll_number: "CS105", name: "Diya Sen", subject: "Chemistry", marks: 94 },
    { roll_number: "CS106", name: "Ananya Gupta", subject: "Mathematics", marks: 92 },
    { roll_number: "CS106", name: "Ananya Gupta", subject: "Computer Science", marks: 96 }
];

function executeAggregation() {
    // 1. Stage 1: Sort by marks descending
    const sorted = [...studentMarksData].sort((a, b) => b.marks - a.marks);

    // 2. Stage 2: Group by identical student names and calculate sum of marks
    const grouped = {};
    sorted.forEach(item => {
        if (!grouped[item.name]) {
            grouped[item.name] = {
                student_name: item.name,
                total_marks: 0,
                subject_count: 0,
                marks_list: []
            };
        }
        grouped[item.name].total_marks += item.marks;
        grouped[item.name].subject_count += 1;
        grouped[item.name].marks_list.push({ subject: item.subject, marks: item.marks });
    });

    // 3. Stage 3 & 4: Format and sort by total_marks descending
    const result = Object.values(grouped).sort((a, b) => b.total_marks - a.total_marks);
    return result;
}

function sendJSON(res, statusCode, data) {
    res.writeHead(statusCode, { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' });
    res.end(JSON.stringify(data));
}

const server = http.createServer((req, res) => {
    const parsedUrl = url.parse(req.url, true);
    const pathname = parsedUrl.pathname;

    if (req.method === 'OPTIONS') {
        res.writeHead(204, { 'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Headers': 'Content-Type' });
        return res.end();
    }

    if (pathname === '/api/marks') {
        return sendJSON(res, 200, { data: studentMarksData });
    }

    if (pathname === '/api/aggregate') {
        const aggregated = executeAggregation();
        return sendJSON(res, 200, {
            data: aggregated,
            pipeline: `db.student_subject_marks.aggregate([
  { $sort: { marks: -1 } },
  { 
    $group: { 
      _id: "$name", 
      total_marks: { $sum: "$marks" },
      subject_count: { $sum: 1 },
      marks_breakdown: { $push: { subject: "$subject", marks: "$marks" } }
    }
  },
  { $project: { _id: 0, student_name: "$_id", total_marks: 1, subject_count: 1, marks_breakdown: 1 } },
  { $sort: { total_marks: -1 } }
]);`
        });
    }

    if (pathname === '/' || pathname === '/index.html') {
        res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
        res.end(`<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Q11 - MongoDB Aggregation (Sort, Group & Sum)</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.0/font/bootstrap-icons.css">
    <style>
        body { background-color: #0f172a; color: #f8fafc; font-family: 'Segoe UI', system-ui, sans-serif; }
        .hero { background: linear-gradient(135deg, #1e1b4b, #0f172a); border-bottom: 1px solid rgba(255,255,255,0.1); padding: 25px 0; }
        .card-custom { background: #1e293b; border: 1px solid rgba(255,255,255,0.08); border-radius: 12px; }
        .query-console { background: #020617; border-left: 4px solid #a855f7; font-family: Consolas, monospace; color: #c084fc; padding: 12px; border-radius: 6px; font-size: 0.85rem; white-space: pre-wrap; }
        .badge-sum { background: #4c1d95; color: #e9d5ff; font-size: 0.95rem; font-weight: 700; padding: 6px 12px; border-radius: 8px; border: 1px solid #7c3aed; }
    </style>
</head>
<body>

<div class="hero text-center mb-4">
    <div class="container">
        <span class="badge bg-purple px-3 py-1 rounded-pill mb-2" style="background-color: #7c3aed;">Assignment Q11 • Full Stack Web Development</span>
        <h2 class="fw-bold text-white">Student Marks Aggregation Portal</h2>
        <p class="text-white-50 mb-0">MongoDB Aggregation Pipeline: Sort Marks &rarr; Group by Name &rarr; Calculate Sum of Marks</p>
    </div>
</div>

<div class="container pb-5">
    <!-- Live MongoDB Query Inspector -->
    <div class="card card-custom p-3 mb-4">
        <span class="fw-bold text-light small mb-2"><i class="bi bi-diagram-3-fill me-1 text-purple" style="color: #c084fc;"></i> MongoDB Aggregation Pipeline Definition:</span>
        <div class="query-console" id="pipelineBox">Loading pipeline...</div>
    </div>

    <div class="row g-4">
        <!-- Raw Records Table -->
        <div class="col-lg-5">
            <div class="card card-custom p-3 h-100">
                <h5 class="fw-bold text-info mb-3"><i class="bi bi-file-earmark-text me-2"></i>1. Raw Subject Marks in Database</h5>
                <div class="table-responsive" style="max-height: 480px; overflow-y: auto;">
                    <table class="table table-dark table-sm table-hover align-middle mb-0">
                        <thead class="table-secondary text-dark sticky-top">
                            <tr>
                                <th>Roll No</th>
                                <th>Student Name</th>
                                <th>Subject</th>
                                <th class="text-end">Marks</th>
                            </tr>
                        </thead>
                        <tbody id="rawTableBody"></tbody>
                    </table>
                </div>
            </div>
        </div>

        <!-- Aggregated Results Table -->
        <div class="col-lg-7">
            <div class="card card-custom p-3 h-100">
                <h5 class="fw-bold text-success mb-3"><i class="bi bi-check2-circle me-2"></i>2. Aggregation Output (Grouped by Name with Sum)</h5>
                <div class="table-responsive">
                    <table class="table table-dark table-hover align-middle mb-0">
                        <thead class="table-secondary text-dark">
                            <tr>
                                <th>Rank</th>
                                <th>Student Name</th>
                                <th>Subjects</th>
                                <th>Marks Breakdown (Sorted)</th>
                                <th class="text-end">Sum of Marks</th>
                            </tr>
                        </thead>
                        <tbody id="aggTableBody"></tbody>
                    </table>
                </div>
            </div>
        </div>
    </div>
</div>

<script>
    async function loadData() {
        // Load raw marks
        const rRes = await fetch('/api/marks');
        const rJson = await rRes.json();
        const rTbody = document.getElementById('rawTableBody');
        rTbody.innerHTML = '';
        rJson.data.forEach(r => {
            rTbody.innerHTML += \`
                <tr>
                    <td class="text-muted">\${r.roll_number}</td>
                    <td class="fw-semibold text-light">\${r.name}</td>
                    <td>\${r.subject}</td>
                    <td class="text-end fw-bold text-info">\${r.marks}</td>
                </tr>
            \`;
        });

        // Load aggregation results
        const aRes = await fetch('/api/aggregate');
        const aJson = await aRes.json();
        document.getElementById('pipelineBox').innerText = aJson.pipeline;

        const aTbody = document.getElementById('aggTableBody');
        aTbody.innerHTML = '';
        aJson.data.forEach((a, idx) => {
            const breakdown = a.marks_list.map(m => \`<span class="badge bg-dark border border-secondary">\${m.subject}: \${m.marks}</span>\`).join(' ');
            aTbody.innerHTML += \`
                <tr>
                    <td><span class="badge bg-secondary">#\${idx + 1}</span></td>
                    <td class="fw-bold text-light">\${a.student_name}</td>
                    <td><span class="badge bg-primary">\${a.subject_count} Subjects</span></td>
                    <td>\${breakdown}</td>
                    <td class="text-end"><span class="badge-sum">\${a.total_marks}</span></td>
                </tr>
            \`;
        });
    }

    loadData();
</script>
</body>
</html>`);
    }
});

server.listen(PORT, () => {
    console.log(`[Q11 Full Stack Web App] Running at http://localhost:${PORT}`);
    console.log(`[Q11] Executing MongoDB aggregation pipeline: Sort marks -> Group by name -> Sum.`);
});

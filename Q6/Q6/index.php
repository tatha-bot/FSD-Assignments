<?php
require_once 'db.php';

$search = trim($_GET['search'] ?? '');

$sql = "SELECT * FROM student_marks";
$params = [];
$types = "";

if (!empty($search)) {
    $sql .= " WHERE roll_no LIKE ? OR student_name LIKE ?";
    $searchTerm = "%$search%";
    $params[] = $searchTerm;
    $params[] = $searchTerm;
    $types = "ss";
}

// Order by total DESC to determine rank
$sql .= " ORDER BY total DESC, percentage DESC, student_name ASC";

$stmt = $conn->prepare($sql);
if (!empty($params)) {
    $stmt->bind_param($types, ...$params);
}
$stmt->execute();
$result = $stmt->get_result();

// Calculate overall statistics
$statsQuery = $conn->query("SELECT 
    COUNT(*) AS total_students,
    MAX(total) AS highest_score,
    AVG(percentage) AS avg_percentage
    FROM student_marks");
$stats = $statsQuery->fetch_assoc();
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>End Semester Examination - Student Rank List</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.0/font/bootstrap-icons.css">
    <style>
        body { background-color: #f0f2f5; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; }
        .header-box { background: linear-gradient(135deg, #0d3b66, #00509d); color: white; padding: 30px 0; }
        .card-custom { border: none; border-radius: 12px; box-shadow: 0 4px 15px rgba(0,0,0,0.06); }
        .table-custom th { background-color: #0d3b66; color: white; vertical-align: middle; }
        .rank-badge-1 { background-color: #ffd700; color: #594300; font-weight: 800; font-size: 0.95rem; }
        .rank-badge-2 { background-color: #e0e0e0; color: #333333; font-weight: 800; font-size: 0.95rem; }
        .rank-badge-3 { background-color: #cd7f32; color: #ffffff; font-weight: 800; font-size: 0.95rem; }
        .rank-badge-other { background-color: #e9ecef; color: #495057; font-weight: 700; }
        .stat-card { background: white; border-radius: 10px; padding: 18px; border-left: 5px solid #00509d; box-shadow: 0 2px 10px rgba(0,0,0,0.05); }
    </style>
</head>
<body>

<div class="header-box text-center mb-4">
    <div class="container">
        <h1 class="fw-bold">Department Examination Cell</h1>
        <p class="fs-5 mb-0 text-white-50">Official Rank List - End Semester Examination (Three Core Courses)</p>
    </div>
</div>

<div class="container pb-5">
    <!-- Summary Statistics -->
    <div class="row g-3 mb-4">
        <div class="col-md-4">
            <div class="stat-card">
                <span class="text-secondary small fw-semibold">Total Appeared Candidates</span>
                <h3 class="fw-bold text-dark mt-1 mb-0"><?= $stats['total_students'] ?? 0; ?> Students</h3>
            </div>
        </div>
        <div class="col-md-4">
            <div class="stat-card" style="border-left-color: #28a745;">
                <span class="text-secondary small fw-semibold">Highest Score Obtained</span>
                <h3 class="fw-bold text-success mt-1 mb-0"><?= $stats['highest_score'] ?? 0; ?> / 300</h3>
            </div>
        </div>
        <div class="col-md-4">
            <div class="stat-card" style="border-left-color: #fd7e14;">
                <span class="text-secondary small fw-semibold">Overall Class Average</span>
                <h3 class="fw-bold text-warning mt-1 mb-0"><?= number_format($stats['avg_percentage'] ?? 0, 2); ?>%</h3>
            </div>
        </div>
    </div>

    <!-- Actions & Search -->
    <div class="card card-custom p-3 bg-white mb-4">
        <div class="row g-3 align-items-center">
            <div class="col-md-6">
                <form method="GET" action="index.php" class="d-flex gap-2">
                    <input type="text" name="search" class="form-control" placeholder="Search by Roll No or Student Name..." value="<?= htmlspecialchars($search); ?>">
                    <button type="submit" class="btn btn-primary px-3"><i class="bi bi-search"></i> Search</button>
                    <?php if (!empty($search)): ?>
                        <a href="index.php" class="btn btn-outline-secondary">Reset</a>
                    <?php endif; ?>
                </form>
            </div>
            <div class="col-md-6 text-md-end">
                <a href="add_student.php" class="btn btn-success fw-semibold">
                    <i class="bi bi-person-plus-fill me-1"></i> Add Student Marks
                </a>
            </div>
        </div>
    </div>

    <!-- Rank List Table -->
    <div class="card card-custom bg-white overflow-hidden">
        <div class="card-header bg-white py-3 border-bottom d-flex justify-content-between align-items-center">
            <h5 class="fw-bold text-dark mb-0">Consolidated Merit / Rank List</h5>
            <span class="text-muted small">Passing Marks: 40 in each course</span>
        </div>
        <div class="table-responsive">
            <table class="table table-hover table-custom align-middle text-center mb-0">
                <thead>
                    <tr>
                        <th style="width: 80px;">Rank</th>
                        <th class="text-start">Roll No</th>
                        <th class="text-start">Student Name</th>
                        <th>Course 1<br><small class="fw-normal">Data Structures (100)</small></th>
                        <th>Course 2<br><small class="fw-normal">Operating Systems (100)</small></th>
                        <th>Course 3<br><small class="fw-normal">DBMS (100)</small></th>
                        <th>Total Marks<br><small class="fw-normal">(Out of 300)</small></th>
                        <th>Percentage</th>
                        <th>Status</th>
                    </tr>
                </thead>
                <tbody>
                    <?php if ($result->num_rows > 0): ?>
                        <?php 
                            $rank = 1;
                            while ($row = $result->fetch_assoc()): 
                                $isPass = ($row['course1'] >= 40 && $row['course2'] >= 40 && $row['course3'] >= 40);
                        ?>
                            <tr>
                                <td>
                                    <?php if ($rank === 1): ?>
                                        <span class="badge rank-badge-1 px-3 py-2 rounded-pill"><i class="bi bi-trophy-fill me-1"></i> 1st</span>
                                    <?php elseif ($rank === 2): ?>
                                        <span class="badge rank-badge-2 px-3 py-2 rounded-pill"><i class="bi bi-award-fill me-1"></i> 2nd</span>
                                    <?php elseif ($rank === 3): ?>
                                        <span class="badge rank-badge-3 px-3 py-2 rounded-pill"><i class="bi bi-award me-1"></i> 3rd</span>
                                    <?php else: ?>
                                        <span class="badge rank-badge-other px-3 py-2 rounded-pill">#<?= $rank; ?></span>
                                    <?php endif; ?>
                                </td>
                                <td class="text-start fw-semibold"><?= htmlspecialchars($row['roll_no']); ?></td>
                                <td class="text-start fw-bold text-dark"><?= htmlspecialchars($row['student_name']); ?></td>
                                <td><?= $row['course1']; ?></td>
                                <td><?= $row['course2']; ?></td>
                                <td><?= $row['course3']; ?></td>
                                <td class="fw-bold fs-6 text-primary"><?= $row['total']; ?></td>
                                <td class="fw-semibold"><?= number_format($row['percentage'], 2); ?>%</td>
                                <td>
                                    <?php if ($isPass): ?>
                                        <span class="badge bg-success">PASS</span>
                                    <?php else: ?>
                                        <span class="badge bg-danger">FAIL</span>
                                    <?php endif; ?>
                                </td>
                            </tr>
                        <?php 
                            $rank++;
                            endwhile; 
                        ?>
                    <?php else: ?>
                        <tr>
                            <td colspan="9" class="py-4 text-muted">
                                No records found matching the query.
                            </td>
                        </tr>
                    <?php endif; ?>
                </tbody>
            </table>
        </div>
    </div>
</div>

<script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js"></script>
</body>
</html>

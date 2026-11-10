<?php
require_once 'db.php';

$message = "";
$messageType = "";

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $rollNo = strtoupper(trim($_POST['roll_no'] ?? ''));
    $name = trim($_POST['student_name'] ?? '');
    $c1 = intval($_POST['course1'] ?? 0);
    $c2 = intval($_POST['course2'] ?? 0);
    $c3 = intval($_POST['course3'] ?? 0);

    if (empty($rollNo) || empty($name)) {
        $message = "Please enter Roll Number and Student Name.";
        $messageType = "danger";
    } elseif ($c1 < 0 || $c1 > 100 || $c2 < 0 || $c2 > 100 || $c3 < 0 || $c3 > 100) {
        $message = "Marks must be between 0 and 100 for each course.";
        $messageType = "danger";
    } else {
        $stmt = $conn->prepare("INSERT INTO student_marks (roll_no, student_name, course1, course2, course3) VALUES (?, ?, ?, ?, ?)");
        $stmt->bind_param("ssiii", $rollNo, $name, $c1, $c2, $c3);
        if ($stmt->execute()) {
            $message = "Student record added successfully!";
            $messageType = "success";
        } else {
            if ($conn->errno === 1062) {
                $message = "Error: Roll Number '$rollNo' already exists in the system.";
            } else {
                $message = "Database error: " . $conn->error;
            }
            $messageType = "danger";
        }
        $stmt->close();
    }
}
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Enter Student Marks - End Semester Exam</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
    <style>
        body { background-color: #f0f2f5; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; }
        .header-box { background: linear-gradient(135deg, #0d3b66, #00509d); color: white; padding: 25px 0; }
        .card-custom { border: none; border-radius: 12px; box-shadow: 0 4px 15px rgba(0,0,0,0.08); }
    </style>
</head>
<body>

<div class="header-box text-center mb-4">
    <div class="container">
        <h2 class="fw-bold">Office of the Controller of Examinations</h2>
        <p class="mb-0 text-white-50">End Semester Examination - Entry of Student Marks</p>
    </div>
</div>

<div class="container pb-5">
    <div class="row justify-content-center">
        <div class="col-lg-7">
            <div class="mb-3">
                <a href="index.php" class="btn btn-outline-secondary btn-sm">&larr; Back to Rank List</a>
            </div>

            <?php if (!empty($message)): ?>
                <div class="alert alert-<?= $messageType; ?> alert-dismissible fade show" role="alert">
                    <?= htmlspecialchars($message); ?>
                    <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
                </div>
            <?php endif; ?>

            <div class="card card-custom p-4 bg-white">
                <h4 class="fw-bold text-dark mb-3 border-bottom pb-2">Add Student Examination Record</h4>
                
                <form action="add_student.php" method="POST">
                    <div class="row">
                        <div class="col-md-6 mb-3">
                            <label class="form-label fw-semibold">Roll Number <span class="text-danger">*</span></label>
                            <input type="text" name="roll_no" class="form-control" placeholder="e.g. CS202611" required>
                        </div>
                        <div class="col-md-6 mb-3">
                            <label class="form-label fw-semibold">Student Full Name <span class="text-danger">*</span></label>
                            <input type="text" name="student_name" class="form-control" placeholder="e.g. Priya Sharma" required>
                        </div>
                    </div>

                    <div class="p-3 bg-light rounded border mb-3">
                        <h6 class="fw-bold text-primary mb-3">Marks Obtained in Three Courses (Out of 100)</h6>

                        <div class="mb-3">
                            <label class="form-label fw-semibold">Course 1: Data Structures & Algorithms</label>
                            <input type="number" name="course1" class="form-control" min="0" max="100" placeholder="0 - 100" required>
                        </div>

                        <div class="mb-3">
                            <label class="form-label fw-semibold">Course 2: Operating Systems</label>
                            <input type="number" name="course2" class="form-control" min="0" max="100" placeholder="0 - 100" required>
                        </div>

                        <div class="mb-2">
                            <label class="form-label fw-semibold">Course 3: Database Management Systems</label>
                            <input type="number" name="course3" class="form-control" min="0" max="100" placeholder="0 - 100" required>
                        </div>
                    </div>

                    <div class="d-flex justify-content-between align-items-center">
                        <a href="index.php" class="btn btn-outline-secondary">Cancel</a>
                        <button type="submit" class="btn btn-primary px-4 fw-semibold">Submit & Calculate Rank</button>
                    </div>
                </form>
            </div>
        </div>
    </div>
</div>

<script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js"></script>
</body>
</html>

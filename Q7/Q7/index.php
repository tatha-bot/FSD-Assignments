<?php
require_once 'db.php';

$actionMessage = "";
$actionType = "";
$updatedRowsCount = 0;
$hikeExecuted = false;

// Handle 10% Hike Action
if (isset($_POST['apply_hike'])) {
    $updateSQL = "UPDATE employee SET salary = ROUND(salary * 1.10, 2)";
    if ($conn->query($updateSQL)) {
        $updatedRowsCount = $conn->affected_rows;
        $actionMessage = "Successfully updated salaries with a 10% increase! (Affected rows: $updatedRowsCount)";
        $actionType = "success";
        $hikeExecuted = true;
    } else {
        $actionMessage = "Error updating salaries: " . $conn->error;
        $actionType = "danger";
    }
}

// Handle Reset Data Action
if (isset($_POST['reset_data'])) {
    seedEmployees($conn);
    $actionMessage = "Database reset to initial sample employee records!";
    $actionType = "info";
}

// Handle Add New Employee
if (isset($_POST['add_employee'])) {
    $empId = strtoupper(trim($_POST['emp_id'] ?? ''));
    $empName = trim($_POST['emp_name'] ?? '');
    $salary = floatval($_POST['salary'] ?? 0);

    if (!empty($empId) && !empty($empName) && $salary > 0) {
        $stmt = $conn->prepare("INSERT INTO employee (emp_id, emp_name, salary) VALUES (?, ?, ?)");
        $stmt->bind_param("ssd", $empId, $empName, $salary);
        if ($stmt->execute()) {
            $actionMessage = "Employee $empName ($empId) added successfully!";
            $actionType = "success";
        } else {
            $actionMessage = "Error: " . ($conn->errno === 1062 ? "Employee ID already exists." : $conn->error);
            $actionType = "danger";
        }
        $stmt->close();
    }
}

// Fetch all employees
$allEmployees = $conn->query("SELECT * FROM employee ORDER BY emp_id ASC");

// Fetch employees with salary > Rs. 50,000
$highSalaryEmployees = $conn->query("SELECT emp_id, emp_name, salary FROM employee WHERE salary > 50000.00 ORDER BY salary DESC");
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Employee Salary 10% Hike & Filter - PHP/MySQL</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.0/font/bootstrap-icons.css">
    <style>
        body { background-color: #f4f6f9; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; }
        .hero-banner { background: linear-gradient(135deg, #1b4965, #2b6cb0); color: white; padding: 30px 0; }
        .card-custom { border: none; border-radius: 12px; box-shadow: 0 4px 15px rgba(0,0,0,0.06); }
        .table-custom th { background-color: #1b4965; color: white; }
        .badge-salary { background-color: #d1e7dd; color: #0f5132; font-weight: 700; font-size: 0.95rem; }
    </style>
</head>
<body>

<div class="hero-banner text-center mb-4">
    <div class="container">
        <h1 class="fw-bold">Employee Payroll Management System</h1>
        <p class="fs-5 mb-0 text-white-50">Assignment Q7: Update Salary (+10% Increase) & Display Records > Rs. 50,000</p>
    </div>
</div>

<div class="container pb-5">
    <?php if (!empty($actionMessage)): ?>
        <div class="alert alert-<?= $actionType; ?> alert-dismissible fade show shadow-sm" role="alert">
            <i class="bi bi-info-circle-fill me-2"></i> <?= htmlspecialchars($actionMessage); ?>
            <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
        </div>
    <?php endif; ?>

    <!-- Action Toolbar -->
    <div class="card card-custom bg-white p-3 mb-4">
        <div class="d-flex flex-wrap justify-content-between align-items-center gap-2">
            <div>
                <h5 class="fw-bold text-dark mb-1">Database Operations</h5>
                <p class="text-muted small mb-0">Execute SQL UPDATE and SELECT queries directly on the live database.</p>
            </div>
            <div class="d-flex gap-2">
                <form method="POST" action="index.php" onsubmit="return confirm('Do you want to apply a 10% salary increase to ALL employees?');">
                    <button type="submit" name="apply_hike" class="btn btn-success fw-semibold shadow-sm">
                        <i class="bi bi-graph-up-arrow me-1"></i> Apply 10% Salary Increase
                    </button>
                </form>
                <form method="POST" action="index.php">
                    <button type="submit" name="reset_data" class="btn btn-outline-secondary">
                        <i class="bi bi-arrow-counterclockwise me-1"></i> Reset Sample Data
                    </button>
                </form>
            </div>
        </div>
    </div>

    <!-- Main Results Row -->
    <div class="row g-4">
        <!-- Section 1: Filtered Output (Salary > Rs. 50,000) -->
        <div class="col-lg-6">
            <div class="card card-custom bg-white h-100 overflow-hidden">
                <div class="card-header bg-success text-white py-3 d-flex justify-content-between align-items-center">
                    <h5 class="fw-bold mb-0">
                        <i class="bi bi-check2-circle me-1"></i> Employees with Salary > Rs. 50,000
                    </h5>
                    <span class="badge bg-white text-success fw-bold px-2 py-1">
                        <?= $highSalaryEmployees->num_rows; ?> Found
                    </span>
                </div>
                <div class="card-body p-3">
                    <p class="text-muted small mb-3">
                        <code>SQL: SELECT emp_id, emp_name, salary FROM employee WHERE salary &gt; 50000;</code>
                    </p>
                    <div class="table-responsive">
                        <table class="table table-hover align-middle mb-0">
                            <thead class="table-light">
                                <tr>
                                    <th>Employee ID</th>
                                    <th>Employee Name</th>
                                    <th class="text-end">Current Salary (Rs.)</th>
                                </tr>
                            </thead>
                            <tbody>
                                <?php if ($highSalaryEmployees->num_rows > 0): ?>
                                    <?php while ($emp = $highSalaryEmployees->fetch_assoc()): ?>
                                        <tr>
                                            <td class="fw-bold text-primary"><?= htmlspecialchars($emp['emp_id']); ?></td>
                                            <td class="fw-semibold text-dark"><?= htmlspecialchars($emp['emp_name']); ?></td>
                                            <td class="text-end">
                                                <span class="badge badge-salary px-3 py-2">
                                                    Rs. <?= number_format($emp['salary'], 2); ?>
                                                </span>
                                            </td>
                                        </tr>
                                    <?php endwhile; ?>
                                <?php else: ?>
                                    <tr>
                                        <td colspan="3" class="text-center py-4 text-muted">
                                            No employees found with salary exceeding Rs. 50,000.
                                        </td>
                                    </tr>
                                <?php endif; ?>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>

        <!-- Section 2: Complete Employee Table -->
        <div class="col-lg-6">
            <div class="card card-custom bg-white h-100 overflow-hidden">
                <div class="card-header bg-dark text-white py-3 d-flex justify-content-between align-items-center">
                    <h5 class="fw-bold mb-0">
                        <i class="bi bi-people-fill me-1"></i> All Employees in Database
                    </h5>
                    <span class="badge bg-light text-dark fw-bold px-2 py-1">
                        <?= $allEmployees->num_rows; ?> Total
                    </span>
                </div>
                <div class="card-body p-3">
                    <p class="text-muted small mb-3">
                        Overview of all employees and their updated salary in the database.
                    </p>
                    <div class="table-responsive" style="max-height: 380px; overflow-y: auto;">
                        <table class="table table-sm table-striped align-middle mb-0">
                            <thead class="table-light sticky-top">
                                <tr>
                                    <th>Emp ID</th>
                                    <th>Name</th>
                                    <th class="text-end">Salary</th>
                                    <th class="text-center">&gt; 50k?</th>
                                </tr>
                            </thead>
                            <tbody>
                                <?php while ($emp = $allEmployees->fetch_assoc()): ?>
                                    <tr>
                                        <td class="fw-semibold"><?= htmlspecialchars($emp['emp_id']); ?></td>
                                        <td><?= htmlspecialchars($emp['emp_name']); ?></td>
                                        <td class="text-end fw-bold">Rs. <?= number_format($emp['salary'], 2); ?></td>
                                        <td class="text-center">
                                            <?php if ($emp['salary'] > 50000): ?>
                                                <span class="badge bg-success">Yes</span>
                                            <?php else: ?>
                                                <span class="badge bg-secondary">No</span>
                                            <?php endif; ?>
                                        </td>
                                    </tr>
                                <?php endwhile; ?>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <!-- Optional: Add New Employee Form -->
    <div class="row justify-content-center mt-4">
        <div class="col-lg-8">
            <div class="card card-custom bg-white p-4">
                <h5 class="fw-bold text-dark mb-3"><i class="bi bi-person-plus me-1"></i> Add New Employee to Database</h5>
                <form action="index.php" method="POST" class="row g-3">
                    <div class="col-md-3">
                        <label class="form-label fw-semibold small">Employee ID</label>
                        <input type="text" name="emp_id" class="form-control" placeholder="EMP109" required>
                    </div>
                    <div class="col-md-5">
                        <label class="form-label fw-semibold small">Employee Name</label>
                        <input type="text" name="emp_name" class="form-control" placeholder="Suresh Menon" required>
                    </div>
                    <div class="col-md-4">
                        <label class="form-label fw-semibold small">Starting Salary (Rs.)</label>
                        <div class="input-group">
                            <input type="number" step="0.01" name="salary" class="form-control" placeholder="47000.00" required>
                            <button type="submit" name="add_employee" class="btn btn-primary fw-semibold">Add</button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    </div>
</div>

<script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js"></script>
</body>
</html>

<?php
// db.php - Database connection & auto-table/data setup for Q6
$host = "localhost";
$user = "root";
$pass = "";
$dbname = "exam_ranks_db";

$conn = new mysqli($host, $user, $pass);
if ($conn->connect_error) {
    die("Database Connection Error: " . $conn->connect_error);
}

// Auto-create database
$conn->query("CREATE DATABASE IF NOT EXISTS `$dbname`");
$conn->select_db($dbname);

// Auto-create student marks table
$tableSQL = "CREATE TABLE IF NOT EXISTS `student_marks` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `roll_no` VARCHAR(20) UNIQUE NOT NULL,
    `student_name` VARCHAR(100) NOT NULL,
    `course1` INT NOT NULL, -- Data Structures
    `course2` INT NOT NULL, -- Operating Systems
    `course3` INT NOT NULL, -- Database Management Systems
    `total` INT GENERATED ALWAYS AS (course1 + course2 + course3) STORED,
    `percentage` DECIMAL(5,2) GENERATED ALWAYS AS ((course1 + course2 + course3) / 3.0) STORED
)";
$conn->query($tableSQL);

// Seed sample students if table is empty
$check = $conn->query("SELECT COUNT(*) AS cnt FROM student_marks");
$count = $check->fetch_assoc()['cnt'] ?? 0;
if ($count == 0) {
    $seedSQL = "INSERT INTO `student_marks` (`roll_no`, `student_name`, `course1`, `course2`, `course3`) VALUES
        ('CS202601', 'Aarav Patel', 95, 92, 98),
        ('CS202602', 'Diya Sen', 88, 94, 91),
        ('CS202603', 'Rohan Sharma', 85, 78, 89),
        ('CS202604', 'Ananya Gupta', 91, 89, 90),
        ('CS202605', 'Vikram Singh', 74, 68, 72),
        ('CS202606', 'Pooja Iyer', 96, 95, 94),
        ('CS202607', 'Rahul Verma', 62, 58, 65),
        ('CS202608', 'Sneha Roy', 79, 83, 80),
        ('CS202609', 'Aditya Joshi', 88, 85, 87),
        ('CS202610', 'Kavya Nair', 55, 60, 58)";
    $conn->query($seedSQL);
}
?>

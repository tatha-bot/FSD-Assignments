<?php
// db.php - Database connection & auto-table creator for Q7
$host = "localhost";
$user = "root";
$pass = "";
$dbname = "company_emp_db";

$conn = new mysqli($host, $user, $pass);
if ($conn->connect_error) {
    die("Database Connection Error: " . $conn->connect_error);
}

// Auto-create database
$conn->query("CREATE DATABASE IF NOT EXISTS `$dbname`");
$conn->select_db($dbname);

// Create employee table
$tableSQL = "CREATE TABLE IF NOT EXISTS `employee` (
    `emp_id` VARCHAR(20) PRIMARY KEY,
    `emp_name` VARCHAR(100) NOT NULL,
    `salary` DECIMAL(10,2) NOT NULL
)";
$conn->query($tableSQL);

function seedEmployees($conn) {
    $conn->query("TRUNCATE TABLE `employee`");
    $insertSQL = "INSERT INTO `employee` (`emp_id`, `emp_name`, `salary`) VALUES
        ('EMP101', 'Rajesh Sharma', 48000.00), -- 48,000 * 1.10 = 52,800 (> 50k)
        ('EMP102', 'Pooja Nair', 35000.00),    -- 35,000 * 1.10 = 38,500 (<= 50k)
        ('EMP103', 'Vikram Malhotra', 65000.00), -- 65,000 * 1.10 = 71,500 (> 50k)
        ('EMP104', 'Sneha Roy', 42000.00),     -- 42,000 * 1.10 = 46,200 (<= 50k)
        ('EMP105', 'Arun Kumar', 55000.00),    -- 55,000 * 1.10 = 60,500 (> 50k)
        ('EMP106', 'Meera Patel', 46000.00),   -- 46,000 * 1.10 = 50,600 (> 50k)
        ('EMP107', 'Karthik Rao', 28000.00),   -- 28,000 * 1.10 = 30,800 (<= 50k)
        ('EMP108', 'Divya Sen', 75000.00)";    -- 75,000 * 1.10 = 82,500 (> 50k)
    $conn->query($insertSQL);
}

// Seed if empty
$check = $conn->query("SELECT COUNT(*) AS cnt FROM employee");
$count = $check->fetch_assoc()['cnt'] ?? 0;
if ($count == 0) {
    seedEmployees($conn);
}
?>

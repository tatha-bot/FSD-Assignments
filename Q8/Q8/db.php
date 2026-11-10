<?php
// db.php - Database connection & auto-table creator for Q8
$host = "localhost";
$user = "root";
$pass = "";
$dbname = "product_inventory_db";

$conn = new mysqli($host, $user, $pass);
if ($conn->connect_error) {
    die("Database Connection Error: " . $conn->connect_error);
}

// Auto-create database
$conn->query("CREATE DATABASE IF NOT EXISTS `$dbname`");
$conn->select_db($dbname);

// Create product table
$tableSQL = "CREATE TABLE IF NOT EXISTS `product` (
    `product_id` VARCHAR(20) PRIMARY KEY,
    `product_name` VARCHAR(150) NOT NULL,
    `price` DECIMAL(10,2) NOT NULL
)";
$conn->query($tableSQL);

function seedProducts($conn) {
    $conn->query("TRUNCATE TABLE `product`");
    $insertSQL = "INSERT INTO `product` (`product_id`, `product_name`, `price`) VALUES
        ('PRD001', 'Wireless Ergonomic Mouse', 1200.00),
        ('PRD002', 'Mechanical RGB Gaming Keyboard', 3500.00),
        ('PRD003', '27-inch 4K IPS Monitor', 24500.00),
        ('PRD004', 'Noise-Cancelling Bluetooth Headphones', 6800.00),
        ('PRD005', 'USB-C Multiport Docking Station', 2900.00),
        ('PRD006', '1TB External NVMe SSD', 8200.00),
        ('PRD007', 'Full HD 1080p Web Camera', 2100.00),
        ('PRD008', 'Ergonomic Laptop Stand', 950.00)";
    $conn->query($insertSQL);
}

// Seed if empty
$check = $conn->query("SELECT COUNT(*) AS cnt FROM product");
$count = $check->fetch_assoc()['cnt'] ?? 0;
if ($count == 0) {
    seedProducts($conn);
}
?>

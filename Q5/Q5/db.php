<?php
// db.php - Database connection & auto-table creation
$host = "localhost";
$user = "root";
$pass = "";
$dbname = "cs_workshop_db";

// Connect to MySQL server
$conn = new mysqli($host, $user, $pass);
if ($conn->connect_error) {
    die("Database Server Connection Failed: " . $conn->connect_error);
}

// Create database if not exists
$conn->query("CREATE DATABASE IF NOT EXISTS `$dbname`");
$conn->select_db($dbname);

// Create workshops table
$createTableSQL = "CREATE TABLE IF NOT EXISTS `workshops` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `title` VARCHAR(255) NOT NULL,
    `coordinator` VARCHAR(150) NOT NULL,
    `start_date` DATE NOT NULL,
    `end_date` DATE NOT NULL,
    `description` TEXT,
    `flyer_path` VARCHAR(255),
    `report_path` VARCHAR(255),
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
)";
$conn->query($createTableSQL);

// Create workshop_photos table for multiple photos
$createPhotosTableSQL = "CREATE TABLE IF NOT EXISTS `workshop_photos` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `workshop_id` INT NOT NULL,
    `photo_path` VARCHAR(255) NOT NULL,
    FOREIGN KEY (`workshop_id`) REFERENCES `workshops`(`id`) ON DELETE CASCADE
)";
$conn->query($createPhotosTableSQL);
?>

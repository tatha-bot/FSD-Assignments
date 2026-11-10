-- Database Schema for Q5
CREATE DATABASE IF NOT EXISTS `cs_workshop_db`;
USE `cs_workshop_db`;

CREATE TABLE IF NOT EXISTS `workshops` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `title` VARCHAR(255) NOT NULL,
    `coordinator` VARCHAR(150) NOT NULL,
    `start_date` DATE NOT NULL,
    `end_date` DATE NOT NULL,
    `description` TEXT,
    `flyer_path` VARCHAR(255),
    `report_path` VARCHAR(255),
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS `workshop_photos` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `workshop_id` INT NOT NULL,
    `photo_path` VARCHAR(255) NOT NULL,
    FOREIGN KEY (`workshop_id`) REFERENCES `workshops`(`id`) ON DELETE CASCADE
);

-- Sample Data
INSERT INTO `workshops` (`title`, `coordinator`, `start_date`, `end_date`, `description`, `flyer_path`, `report_path`) VALUES
('National Workshop on Cloud Computing & DevOps', 'Dr. Ramesh Kumar', '2026-02-10', '2026-02-12', 'A hands-on 3-day workshop focusing on Docker, Kubernetes, and AWS cloud architecture for postgraduate students.', NULL, NULL),
('Faculty Development Program on Machine Learning in Python', 'Prof. Anita Sharma', '2026-03-05', '2026-03-09', 'A 5-day faculty development training program covering regression, classification, neural networks and TensorFlow.', NULL, NULL);

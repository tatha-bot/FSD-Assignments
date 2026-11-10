-- Database Schema for Q6: Student Rank List
CREATE DATABASE IF NOT EXISTS `exam_ranks_db`;
USE `exam_ranks_db`;

CREATE TABLE IF NOT EXISTS `student_marks` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `roll_no` VARCHAR(20) UNIQUE NOT NULL,
    `student_name` VARCHAR(100) NOT NULL,
    `course1` INT NOT NULL, -- Data Structures (out of 100)
    `course2` INT NOT NULL, -- Operating Systems (out of 100)
    `course3` INT NOT NULL, -- DBMS (out of 100)
    `total` INT GENERATED ALWAYS AS (course1 + course2 + course3) STORED,
    `percentage` DECIMAL(5,2) GENERATED ALWAYS AS ((course1 + course2 + course3) / 3.0) STORED
);

-- Sample Data for Examination Results
INSERT INTO `student_marks` (`roll_no`, `student_name`, `course1`, `course2`, `course3`) VALUES
('CS202601', 'Aarav Patel', 95, 92, 98),
('CS202602', 'Diya Sen', 88, 94, 91),
('CS202603', 'Rohan Sharma', 85, 78, 89),
('CS202604', 'Ananya Gupta', 91, 89, 90),
('CS202605', 'Vikram Singh', 74, 68, 72),
('CS202606', 'Pooja Iyer', 96, 95, 94),
('CS202607', 'Rahul Verma', 62, 58, 65),
('CS202608', 'Sneha Roy', 79, 83, 80),
('CS202609', 'Aditya Joshi', 88, 85, 87),
('CS202610', 'Kavya Nair', 55, 60, 58);

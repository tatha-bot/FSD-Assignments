-- Database Schema for Q7: Employee Salary Update
CREATE DATABASE IF NOT EXISTS `company_emp_db`;
USE `company_emp_db`;

CREATE TABLE IF NOT EXISTS `employee` (
    `emp_id` VARCHAR(20) PRIMARY KEY,
    `emp_name` VARCHAR(100) NOT NULL,
    `salary` DECIMAL(10,2) NOT NULL
);

-- Initial Sample Employee Records
INSERT INTO `employee` (`emp_id`, `emp_name`, `salary`) VALUES
('EMP101', 'Rajesh Sharma', 48000.00),
('EMP102', 'Pooja Nair', 35000.00),
('EMP103', 'Vikram Malhotra', 65000.00),
('EMP104', 'Sneha Roy', 42000.00),
('EMP105', 'Arun Kumar', 55000.00),
('EMP106', 'Meera Patel', 46000.00),
('EMP107', 'Karthik Rao', 28000.00),
('EMP108', 'Divya Sen', 75000.00);

-- Query to update salary with 10% increase:
-- UPDATE employee SET salary = ROUND(salary * 1.10, 2);

-- Query to display employees whose salary is greater than Rs. 50,000:
-- SELECT emp_id, emp_name, salary FROM employee WHERE salary > 50000.00;

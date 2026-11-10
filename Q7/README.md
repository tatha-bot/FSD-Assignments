# Q7: Update Employee Salary (+10%) & Filter Salary > Rs. 50,000

## Problem Statement
A database contains employee name, employee ID and salary. Write a PHP program to update the salary of employees available in the database by giving 10% increase in their salary and display the updated information of the employees whose salary is greater than Rs. 50,000.

---

## Core SQL Queries Used
1. **10% Salary Increase Query:**
   ```sql
   UPDATE employee SET salary = ROUND(salary * 1.10, 2);
   ```
2. **Display High-Earner Employees (> Rs. 50,000):**
   ```sql
   SELECT emp_id, emp_name, salary 
   FROM employee 
   WHERE salary > 50000.00 
   ORDER BY salary DESC;
   ```

---

## Features
- **One-Click 10% Salary Hike:** Executes the SQL UPDATE query across all employees in the database.
- **Automated Filtering:** Immediately selects and displays all employees whose new salary exceeds Rs. 50,000 in a formatted green table.
- **Comparison Table:** Shows complete employee list with status indicators.
- **Reset Sample Records:** Button to reset initial employee salaries back to testing values so examiners can re-test the 10% hike.
- **Auto-Database Initializer:** Connects to MySQL and auto-creates `company_emp_db` and seeds sample records on first visit.

---

## File Structure
- `db.php` - Database connection and automatic table and seed generator.
- `index.php` - Complete interactive PHP page executing the 10% hike and displaying the filtered employees.
- `database.sql` - Standalone SQL schema and records.

---

## How to Run
1. Start **Apache** and **MySQL** in XAMPP / WAMP.
2. Put the `Q7` folder in your `htdocs` directory (e.g. `C:/xampp/htdocs/Q7`).
3. Open your browser and visit:
   ```
   http://localhost/Q7/
   ```
4. Or run via PHP built-in server:
   ```bash
   php -S localhost:8000
   ```
   and visit `http://localhost:8000`.

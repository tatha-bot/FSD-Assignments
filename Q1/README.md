# Q1: Employee Registration Form (HTML, CSS, PHP, MySQL)

## 📌 Problem Statement
Develop an Employee Registration web page using HTML and CSS for capturing employee personal and professional information, and write a PHP script to store the submitted registration data into a MySQL database.

---

## 🛠️ Features & Form Fields Captured
- **Personal Details:** Employee ID, Employee Full Name, Gender, Date of Birth (DOB)
- **Contact Details:** Email Address, Phone Number, Residential Address
- **Employment Details:** Department, Designation, Date of Joining, Experience (Years), Employment Type (Full-time, Part-time, Contract, Intern)

---

## 🗄️ Database Setup (MySQL)
Run the following SQL query in phpMyAdmin or MySQL CLI:

```sql
CREATE DATABASE IF NOT EXISTS employee_db;
USE employee_db;

CREATE TABLE IF NOT EXISTS employees (
    id INT AUTO_INCREMENT PRIMARY KEY,
    employee_id VARCHAR(50) NOT NULL UNIQUE,
    employee_name VARCHAR(100) NOT NULL,
    gender VARCHAR(10) NOT NULL,
    dob DATE NOT NULL,
    department VARCHAR(50) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    phone VARCHAR(20) NOT NULL,
    address TEXT NOT NULL,
    designation VARCHAR(50) NOT NULL,
    joining_date DATE NOT NULL,
    experience INT NOT NULL,
    employment_type VARCHAR(20) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

---

## 🚀 How to Run

### Method 1: Using XAMPP / WAMP / LAMP
1. Copy or move this folder into your web server's document root (e.g. `C:\xampp\htdocs\employee_reg` or equivalent).
2. Start **Apache** and **MySQL** in the XAMPP Control Panel.
3. Import the database schema from the SQL snippet above using phpMyAdmin (`http://localhost/phpmyadmin`).
4. Ensure database credentials in `db_connect.php` match your environment (`localhost`, `root`, blank password, database `employee_db`).
5. Open your web browser and navigate to:
   ```text
   http://localhost/employee_reg/index.html
   ```
6. Fill in the employee registration form and click **Register Employee**. You will see a confirmation message and the record will be stored in MySQL.

### Method 2: Using PHP Built-in Server
If PHP and MySQL are already installed on your machine:
```bash
php -S localhost:8000
```
Open: `http://localhost:8000/index.html`

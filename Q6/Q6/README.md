# Q6: End Semester Examination - Student Rank List

## Problem Statement
Develop a web application using PHP and MySQL for displaying the rank list of students appeared for end semester examination for three courses.

---

## Features
1. **Three Core Courses Evaluation:**
   - Course 1: Data Structures
   - Course 2: Operating Systems
   - Course 3: Database Management Systems (DBMS)
2. **Dynamic Ranking System:**
   - Evaluates Total Marks (out of 300) and Percentage.
   - Automatically orders and assigns Rank 1 (Gold 🥇), Rank 2 (Silver 🥈), Rank 3 (Bronze 🥉), and onwards.
3. **Key Academic Statistics:**
   - Displays Class Topper Score, Class Average percentage, and Total Appeared Candidates.
4. **Student Data Management:**
   - Form to add new student marks (`add_student.php`) with range validation (0 to 100).
   - Search functionality by Roll Number or Student Name.
5. **Auto-Database Setup:**
   - Automatically initializes the database `exam_ranks_db` and seeds 10 sample records if empty!

---

## File Structure
- `db.php` - Database connection and automatic schema & seed data initializer.
- `index.php` - Main page displaying the student merit/rank list and statistics.
- `add_student.php` - Form to add new student examination marks.
- `database.sql` - Standalone SQL schema and sample student records.

---

## How to Run
1. Start **Apache** and **MySQL** in XAMPP / WAMP.
2. Put the `Q6` folder into your `htdocs` directory (e.g. `C:/xampp/htdocs/Q6`).
3. Open your browser and go to:
   ```
   http://localhost/Q6/
   ```
4. Or start the built-in server inside this folder:
   ```bash
   php -S localhost:8000
   ```
   and visit `http://localhost:8000`.

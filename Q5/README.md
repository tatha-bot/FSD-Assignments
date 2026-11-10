# Q5: Department of Computer Science - Workshop Portal

## Problem Statement
Develop a website for Department of Computer Science for uploading the details of workshop conducted during a particular period with its flyer, photos and reports using PHP.

---

## Features
1. **Upload Workshop Details:**
   - Workshop Title, Coordinator name, Start date and End date (period).
   - Brief Description / Summary.
   - File uploads for **Flyer (Poster)**, **Photos (Multiple selection)**, and **Report (PDF/Document)**.
2. **Filtering by Period:**
   - Search/filter workshops conducted between specific dates (`from_date` to `to_date`).
3. **Gallery & Downloads:**
   - View uploaded flyers and event photos in a responsive gallery.
   - Download the official workshop report directly.
4. **Auto-Database Setup:**
   - The system automatically creates the database `cs_workshop_db` and tables (`workshops`, `workshop_photos`) on first load!

---

## File Structure
- `db.php` - Database connection and automatic database/table creator.
- `index.php` - Homepage displaying all conducted workshops with date filter.
- `upload.php` - Upload form for workshop details, flyer, photos, and report.
- `view.php` - Detailed single workshop view with gallery and report download.
- `database.sql` - Standalone SQL schema and sample data.

---

## How to Run
1. Start **Apache** and **MySQL** in XAMPP or WAMP.
2. Place this `Q5` folder inside `htdocs` (e.g. `C:/xampp/htdocs/Q5`).
3. Open your browser and navigate to:
   ```
   http://localhost/Q5/
   ```
4. Or use PHP's built-in server from this folder:
   ```bash
   php -S localhost:8000
   ```
   and visit `http://localhost:8000`.

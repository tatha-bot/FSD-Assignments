# Full Stack Development Laboratory (Third Semester: July – Dec 2026)

[![Node.js](https://img.shields.io/badge/Node.js-v18%2B-green.svg)](https://nodejs.org/)
[![React](https://img.shields.io/badge/React-v18-blue.svg)](https://reactjs.org/)
[![Vite](https://img.shields.io/badge/Vite-v5-646CFF.svg)](https://vitejs.dev/)
[![Express](https://img.shields.io/badge/Express.js-v4.19-lightgrey.svg)](https://expressjs.com/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Mongoose-green.svg)](https://www.mongodb.com/)
[![PHP](https://img.shields.io/badge/PHP-v8%2B-777BB4.svg)](https://www.php.net/)
[![MySQL](https://img.shields.io/badge/MySQL-v8%2B-4479A1.svg)](https://www.mysql.com/)

A comprehensive collection of 20 lab practical assignments covering the entire full-stack spectrum:
1. **Front-End Fundamentals:** HTML5, CSS3, DOM scripting, and JavaScript validation (Q2 – Q4)
2. **Relational Database Web Apps:** PHP 8 and MySQL relational databases (Q1, Q5 – Q8)
3. **NoSQL Document Database Operations:** MongoDB Shell scripts, Node.js drivers, and Aggregation pipelines (Q9 – Q12)
4. **Component-Based UI:** Modular React.js Single-Page Applications (Q13 – Q16)
5. **Full-Stack Enterprise MERN Applications:** Complete MongoDB, Express, React, and Node.js systems with smart in-memory fallbacks, pre-seeded datasets, and interactive UI dashboards (Q17 – Q20)

---

## 📋 Comprehensive Question Index

| # | Project / Practical Title | Tech Stack | Directory | Highlights & Features |
|:---:|:---|:---|:---|:---|
| **Q1** | **Employee Registration Portal** | HTML, CSS, PHP, MySQL | [`Q1/`](./Q1/) | Registration form inserting employee data into MySQL with confirmation display. |
| **Q2** | **Student Exam Registration** | HTML, CSS, JavaScript | [`Q2/`](./Q2/) | Form validation with 75% attendance threshold check for exam eligibility. |
| **Q3** | **Library Book Lending & Returning** | HTML, CSS, JavaScript | [`Q3/`](./Q3/) | Book issue/return validation enforcing student age between 18 and 30 years. |
| **Q4** | **Display Server Domain Name** | HTML, CSS, JavaScript | [`Q4/`](./Q4/) | Dynamic server domain retrieval and rendering via `document.domain`. |
| **Q5** | **CS Workshop Registration & Abstract** | PHP, MySQL, CSS | [`Q5/`](./Q5/) | Workshop registrations with PDF abstract file upload and roster viewing. |
| **Q6** | **Semester Exam Student Rank List** | PHP, MySQL, CSS | [`Q6/`](./Q6/) | Computes total marks, sorts scores, and assigns university rank numbers. |
| **Q7** | **Employee Salary Hike & Filter** | PHP, MySQL, CSS | [`Q7/`](./Q7/) | Executes 10% salary revision and filters employees earning > Rs. 50,000. |
| **Q8** | **Product Price Increase Portal** | PHP, MySQL, CSS | [`Q8/`](./Q8/) | Increases all product prices by 5% and renders old vs. new price comparison. |
| **Q9** | **Student Course Registration Database** | MongoDB, Node.js | [`Q9/`](./Q9/) | MongoDB CRUD operations for student enrollments and course records. |
| **Q10** | **Employee Salary Increment Engine** | MongoDB, Node.js | [`Q10/`](./Q10/) | Increments employee salaries by Rs. 1,000 using `$inc` update operator. |
| **Q11** | **Marks Aggregation & Grouping** | MongoDB, Node.js | [`Q11/`](./Q11/) | Multi-stage aggregation: `$match`, `$group` by student name, `$sum` marks, `$sort`. |
| **Q12** | **Retail Shop Stock Details & Updates** | MongoDB, Node.js | [`Q12/`](./Q12/) | Inventory schema with stock addition, threshold tracking, and price updates. |
| **Q13** | **Interactive Arithmetic Calculator** | React.js, CSS | [`Q13/`](./Q13/) | React calculator performing addition, subtraction, multiplication, and division. |
| **Q14** | **Responsive Image Gallery** | React.js, CSS | [`Q14/`](./Q14/) | Filterable dynamic image showcase with modal preview lightbox. |
| **Q15** | **Time-Based Greeting Application** | React.js, CSS | [`Q15/`](./Q15/) | Real-time digital clock rendering dynamic greetings (Morning / Afternoon / Evening). |
| **Q16** | **Job Candidate Interview Profile App** | React.js, CSS | [`Q16/`](./Q16/) | Candidate evaluation dashboard with score calculating and interview decision status. |
| **Q17** | **Hospital Daily Wage Salary System** | MERN Stack | [`Q17/`](./Q17/) | Wage calculator based on days worked, role rates, overtime, and salary slips. |
| **Q18** | **Employee Management & Directory** | MERN Stack | [`Q18/`](./Q18/) | Full CRUD employee directory with department filters, salary metrics, and modals. |
| **Q19** | **OpportunityHub Job & Vacancy Portal** | MERN Stack | [`Q19/`](./Q19/) | Job board to browse openings, post vacancies, and submit applications. |
| **Q20** | **TrustBank Savings Account Portal** | MERN Stack | [`Q20/`](./Q20/) | Banking system with deposit, withdrawal, balance checks, and transaction logs. |

---

## 🛠️ Global Prerequisites

Before running the projects, ensure you have the following installed on your machine:

- **Node.js** (v18.0.0 or higher recommended) & **npm** (v9+): [Download Node.js](https://nodejs.org/)
- **PHP** (v7.4 or v8.x) & **MySQL / MariaDB** (or [XAMPP](https://www.apachefriends.org/index.html) / WampServer)
- **MongoDB** (Optional): MongoDB Community Server or MongoDB Atlas.
  > **Note for MERN (Q17 – Q20):** Every MERN project is engineered with an automatic **in-memory data store fallback** pre-seeded with sample records. If local MongoDB is not running, the projects run out-of-the-box in standalone mode without any errors!

---

# 🚀 How to Run Each Project

Follow the dedicated step-by-step instructions below for each question:

---

### 🔹 Category 1: Front-End Form & DOM Applications (Q2 – Q4)

#### **Q2: Student Examination Registration (Attendance Check >= 75%)**
```bash
# Navigate to the folder
cd "Q2/2"

# Option A: Run local HTTP server
python -m http.server 8080
# Visit http://localhost:8080 in your browser

# Option B: Direct Open
# Simply double-click Q2/2/index.html in Windows Explorer
```

#### **Q3: Library Book Lending & Returning (Age Validation 18–30)**
```bash
# Navigate to the folder
cd "Q3/3"

# Option A: Run local HTTP server
python -m http.server 8080
# Visit http://localhost:8080 in your browser

# Option B: Direct Open
# Simply double-click Q3/3/index.html in Windows Explorer
```

#### **Q4: Display Server Domain Name (`document.domain`)**
```bash
# Navigate to the folder
cd "Q4/4"

# Start local server (recommended to test domain resolution)
python -m http.server 8080
# Visit http://localhost:8080 and click "Display Domain"
```

---

### 🔹 Category 2: PHP & MySQL Database Applications (Q1, Q5 – Q8)

#### **Database Setup (Common for all PHP questions)**
1. Open XAMPP Control Panel and start **Apache** and **MySQL**.
2. Open phpMyAdmin at `http://localhost/phpmyadmin` or use the MySQL CLI.
3. Import the SQL file included in each question folder.

#### **Q1: Employee Registration Form**
```bash
# 1. Import database
mysql -u root -p -e "CREATE DATABASE IF NOT EXISTS company_db;"
mysql -u root -p company_db < "Q1/1/database.sql" # Or create table employees as described in Q1/README.md

# 2. Run with built-in PHP development server
cd "Q1/1"
php -S localhost:8000
# Open http://localhost:8000 in your browser
```

#### **Q5: Department of CS - Workshop Portal (File Upload)**
```bash
# 1. Import database schema
mysql -u root -p < "Q5/Q5/database.sql"

# 2. Run PHP development server
cd "Q5/Q5"
php -S localhost:8000
# Open http://localhost:8000/index.php
```

#### **Q6: End Semester Examination - Student Rank List**
```bash
# 1. Import database schema & seed data
mysql -u root -p < "Q6/Q6/database.sql"

# 2. Run PHP development server
cd "Q6/Q6"
php -S localhost:8000
# Open http://localhost:8000/index.php
```

#### **Q7: Employee Salary Increment (+10%) & Filter (> 50,000)**
```bash
# 1. Import database schema & seed data
mysql -u root -p < "Q7/Q7/database.sql"

# 2. Run PHP development server
cd "Q7/Q7"
php -S localhost:8000
# Open http://localhost:8000/index.php
```

#### **Q8: Product Price Hike (+5%) Comparison Portal**
```bash
# 1. Import database schema & seed products
mysql -u root -p < "Q8/Q8/database.sql"

# 2. Run PHP development server
cd "Q8/Q8"
php -S localhost:8000
# Open http://localhost:8000/index.php
```

---

### 🔹 Category 3: MongoDB Operations & Aggregations (Q9 – Q12)

All MongoDB projects include a Node.js script connecting to MongoDB (`mongodb://127.0.0.1:27017`) and standalone `mongo_queries.js` scripts runnable in `mongosh`.

#### **Q9: Student Course Registration Database**
```bash
cd "Q9/Q9"
npm install
# Option A: Run via Node.js
node server.js
# Option B: Run in MongoDB Shell
mongosh < mongo_queries.js
```

#### **Q10: Increment Employee Salary by 1000**
```bash
cd "Q10/Q10"
npm install
# Option A: Run via Node.js
node server.js
# Option B: Run in MongoDB Shell
mongosh < mongo_queries.js
```

#### **Q11: MongoDB Aggregation (Sort, Group by Name, Sum Marks)**
```bash
cd "Q11/Q11"
npm install
# Option A: Run via Node.js
node server.js
# Option B: Run in MongoDB Shell
mongosh < mongo_queries.js
```

#### **Q12: Retail Shop Stock Inventory & Updates**
```bash
cd "Q12/Q12"
npm install
# Option A: Run via Node.js
node server.js
# Option B: Run in MongoDB Shell
mongosh < mongo_queries.js
```

---

### 🔹 Category 4: React.js Component Applications (Q13 – Q16)

#### **Q13: Simple Arithmetic Calculator**
```bash
cd "Q13/Q13"
npm install
npm start
# Open http://localhost:3000 in your browser
```

#### **Q14: Image Gallery Showcase**
```bash
cd "Q14/Q14"
npm install
npm start
# Open http://localhost:3000 in your browser
```

#### **Q15: Greeting Application Based on Current Time**
```bash
cd "Q15/Q15"
npm install
npm start
# Open http://localhost:3000 in your browser
```

#### **Q16: Candidate Job Interview Profile App**
```bash
cd "Q16/Q16"
npm install
npm start
# Open http://localhost:3000 in your browser
```

---

### 🔹 Category 5: Full-Stack MERN Enterprise Applications (Q17 – Q20)

> 💡 **Built-in Smart Data Fallback:** Questions 17 through 20 are configured to connect to MongoDB if available, but automatically fall back to high-performance in-memory stores pre-populated with realistic seed data if MongoDB is not running locally. They run seamlessly out of the box!

#### **Q17: Hospital Administration Daily Wage System**
- **Client Port:** `http://localhost:5173`
- **Server Port:** `http://localhost:5001`

```bash
cd "Q17/Q17"

# Option A: Run both Client and Server concurrently from root
npm run dev

# Option B: Run Server and Client in separate terminals
# Terminal 1 (Backend):
cd server
npm install
npm start

# Terminal 2 (Frontend):
cd ../client
npm install
npm run dev
```

#### **Q18: Employee Management & Directory System**
- **Client Port:** `http://localhost:3002`
- **Server Port:** `http://localhost:5002`

```bash
cd "Q18/Q18"

# Option A: Run both Client and Server concurrently from root
npm run dev

# Option B: Run Server and Client in separate terminals
# Terminal 1 (Backend):
cd server
npm install
npm start

# Terminal 2 (Frontend):
cd ../client
npm install
npm run dev
```

#### **Q19: OpportunityHub — Job Vacancy & Application Portal**
- **Frontend Port:** `http://localhost:5173`
- **Backend Port:** `http://localhost:5000`

```bash
cd "Q19/Q19"

# Option A: Run both Frontend and Backend concurrently from root
npm run dev

# Option B: Run Backend and Frontend in separate terminals
# Terminal 1 (Backend):
cd backend
npm install
npm run dev

# Terminal 2 (Frontend):
cd ../frontend
npm install
npm run dev
```

#### **Q20: TrustBank — Savings Account Banking System**
- **Frontend Port:** `http://localhost:5173`
- **Backend Port:** `http://localhost:5000`

```bash
cd "Q20/Q20"

# Option A: Run both Frontend and Backend concurrently from root
npm run dev

# Option B: Run Backend and Frontend in separate terminals
# Terminal 1 (Backend):
cd backend
npm install
npm run dev

# Terminal 2 (Frontend):
cd ../frontend
npm install
npm run dev
```

---

## 📦 How to Upload this Repository to GitHub

A comprehensive `.gitignore` file has already been placed in the repository root to exclude all `node_modules/`, local `.env` files, production builds (`dist/`, `build/`), and OS cache files (`.DS_Store`).

To push this codebase to your GitHub account:

```bash
# 1. Initialize a new Git repository (if not already done)
git init

# 2. Add all files (respecting .gitignore)
git add .

# 3. Create your first commit
git commit -m "Initial commit: Complete Full Stack Development Lab practical solutions (Q1 - Q20)"

# 4. Create a new repository on github.com, then link remote:
git branch -M main
git remote add origin https://github.com/<YOUR_GITHUB_USERNAME>/<YOUR_REPOSITORY_NAME>.git

# 5. Push to GitHub
git push -u origin main
```

---

## 👨‍💻 Author & Academic Information
- **Course:** Full Stack Development Laboratory
- **Semester:** Third Semester (July – December 2026)
- **Status:** All 20 practical questions verified, tested, and fully working.

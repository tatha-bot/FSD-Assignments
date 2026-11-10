# 🏥 Hospital Administration - Daily Wage Employees Salary Management System (MERN Stack)

> **Assignment / Practical Question Reference:**
> **Q17.** *Develop a web site for hospital administration for paying the salary of daily wage employees using MERN Stack development. Do and save it into Downloads folder.*

---

## 📌 Project Overview
In a multi-speciality hospital, daily wage staff (such as **Ward Boys, Housekeeping/Sanitation Workers, Stretcher Bearers, Ayahs, Security Guards, Dietary Staff, Maintenance Electricians, and Lab Attendants**) are essential for 24/7 healthcare operations. Unlike monthly salaried medical officers, daily wage employees receive compensation calculated from **daily attendance shifts, emergency duty overtime hours, and special hazard allowances**.

This project provides an end-to-end **MERN Stack (MongoDB, Express.js, React.js, Node.js)** enterprise solution for hospital payroll administrators to:
1. Maintain a directory of daily wage workers with assigned wards, daily rates, and banking/UPI details.
2. Mark daily attendance shifts (Full Day, Half-Day, Absent) with overtime tracking supervised by ward head nurses.
3. Automatically compute daily, weekly, or custom-period salaries with allowances and deductions.
4. Disburse salaries via Hospital Cash Counter, UPI, or NEFT bank transfer with audited transaction IDs.
5. Generate and print official **Hospital Daily Wage Salary Slips / Vouchers** with hospital registration, amount in words, and authorized signatory seals.
6. Provide an administrative dashboard displaying today's active workforce, daily wage liabilities, and department expense breakdowns.

---

## 🏗️ Architecture & Technology Stack

| Layer | Technology | Role & Purpose |
| :--- | :--- | :--- |
| **Frontend (Client)** | **React.js 18 + Vite** | Responsive Admin Portal, interactive shift rosters, instant salary preview calculators, printable pay slip modals |
| **Icons & Design** | **Lucide React + Modern CSS** | Clean medical aesthetic, status pills, print layout styling |
| **Backend (Server)** | **Node.js + Express.js** | RESTful API service handling workforce CRUD, attendance validation, wage calculation algorithms, and payment disbursals |
| **Database** | **MongoDB + Mongoose** | Schemas for Employees, Shift Attendance, and Salary Disbursements. Includes an intelligent zero-downtime file-persistent fallback (`SmartStore`) ensuring full operability even if the local MongoDB daemon is temporarily stopped. |

```
                       +-----------------------------------+
                       |    React Administration UI        |
                       |  (Dashboard, Roster, Wage Calc)   |
                       +-----------------+-----------------+
                                         | HTTP / REST (port 3000 -> 5000)
                                         v
                       +-----------------+-----------------+
                       |    Express.js Node API Server     |
                       |   (/api/employees, /api/salary)   |
                       +-----------------+-----------------+
                                         | Mongoose ODM
                                         v
              +--------------------------+--------------------------+
              |                                                     |
              v (Live Connection)                                   v (Fallback/Self-contained)
+-------------------------------+              +-------------------------------------+
|        MongoDB Database       |              | SmartStore File Engine (data/db.json)|
| (hospital_daily_wage cluster) |              |  Ensures instant 100% demo uptime   |
+-------------------------------+              +-------------------------------------+
```

---

## 📐 Database Schemas (Mongoose)

### 1. Daily Wage Employee Schema (`models/Employee.js`)
* `empId`: Unique Hospital ID (e.g. `HSP-DW-101`)
* `name`: Worker's full name
* `role`: Ward Boy, Ayah, Housekeeping, Security, Stretcher Bearer, etc.
* `department`: Emergency & Trauma, ICU, General Wards, OT, Dietary, Security, Facilities
* `dailyWageRate`: Fixed daily compensation (e.g. ₹650 / day)
* `overtimeHourlyRate`: Overtime hourly wage (e.g. ₹120 / hr)
* `shift`: Morning (06:00-14:00), Evening (14:00-22:00), Night (22:00-06:00), General
* `bankAccount`: Account number, IFSC code, Bank name, UPI ID
* `status`: Active / Inactive

### 2. Daily Attendance & Shift Schema (`models/Attendance.js`)
* `date`: YYYY-MM-DD
* `employeeId`: Reference to Employee
* `status`: Present (8 hrs), Half-Day (4 hrs), Absent, On-Leave
* `shiftHours`: Hours worked on shift
* `overtimeHours`: Emergency overtime hours (0 to 12 hrs)
* `supervisor`: Duty Sister / Nurse Supervisor logging the shift
* `remarks`: Ward transfer or emergency surgery assist notes

### 3. Salary Payment Disbursal Schema (`models/SalaryPayment.js`)
* `paymentId`: Unique Voucher ID (e.g. `HSP-PAY-2026-001`)
* `periodType`: Daily, Weekly, Custom Range
* `startDate` & `endDate`: Shift period covered
* `dailyWageRate`: Base rate applied
* `daysPresent` & `halfDays`: Total attendance count
* `totalOvertimeHours`: Aggregate OT hours
* `baseWage`: `(daysPresent × dailyRate) + (halfDays × dailyRate / 2)`
* `overtimeWage`: `totalOvertimeHours × overtimeHourlyRate`
* `hospitalAllowance`: Special duty or meal allowance
* `deductions`: Uniform / advance deductions
* `netPayable`: Final wage disbursed
* `paymentMethod`: Hospital Cash Counter, UPI Instant Pay, Bank Transfer
* `transactionReference`: Audited tracking code
* `disbursedBy`: Accounts Officer signature

---

## 🧮 Salary Calculation Formula

The net wage payable to each daily wage worker is computed using the following formula:

$$\text{Base Wage} = (\text{Days Present} \times \text{Daily Wage Rate}) + \left(\text{Half-Days} \times \frac{\text{Daily Wage Rate}}{2}\right)$$

$$\text{Overtime Wage} = \text{Total Overtime Hours} \times \text{Overtime Hourly Rate}$$

$$\mathbf{Net\ Wage\ Payable} = \text{Base Wage} + \text{Overtime Wage} + \text{Hospital Allowances} - \text{Deductions}$$

---

## 🚀 Quick Setup & Run Instructions

### Step 1: Open Terminal in Project Directory
```bash
cd /Users/mandal/Downloads/hospital-daily-wage-system
```

### Step 2: One-Click Launch (Recommended)
An executable startup script is included:
```bash
./start.sh
```
This automatically verifies dependencies and launches:
* **Frontend Web App:** [http://localhost:3000](http://localhost:3000)
* **Backend REST API:** [http://localhost:5000](http://localhost:5000)

### Manual Launch (Alternative)
```bash
# Terminal 1 - Backend Server
cd server
npm start

# Terminal 2 - Frontend Client
cd client
npm run dev
```

---

## 📡 REST API Documentation

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/api/stats` | Hospital administration metrics (total staff, today active, liabilities, payouts) |
| `GET` | `/api/employees` | List all daily wage staff with filters (`?q=...&department=...`) |
| `POST` | `/api/employees` | Register new hospital daily wage worker |
| `PUT` | `/api/employees/:id` | Update daily rate, assigned ward, or banking details |
| `DELETE`| `/api/employees/:id` | Remove worker record |
| `GET` | `/api/attendance` | Fetch attendance records for date/employee |
| `POST` | `/api/attendance` | Mark single employee attendance and overtime |
| `POST` | `/api/attendance/bulk` | Bulk roll-call submission for entire shift roster |
| `POST` | `/api/salary/calculate` | Preview computed wage breakdown before paying |
| `POST` | `/api/salary/pay` | Disburse wage and generate printable salary receipt |
| `POST` | `/api/salary/batch-disburse` | 1-Click bulk daily wage settlement for all attended staff |
| `GET` | `/api/salary/payments` | Audit payment history register |
| `GET` | `/api/salary/payments/:id` | Fetch specific payment receipt voucher |

---

## 💡 Practical Exam / Viva Voce Questions & Answers

**Q1. Why is the MERN stack chosen for hospital administration daily wage payment?**
> *Answer:* React provides a fast single-page interface for ward supervisors and accounts officers to perform real-time wage calculation without full page reloads. Express and Node.js provide non-blocking asynchronous REST APIs for handling concurrent attendance logging and instant payment slips. MongoDB's flexible document structure allows storing nested shift logs and banking/UPI data naturally.

**Q2. How is daily wage calculation different from monthly salaried employee payroll?**
> *Answer:* Monthly payroll calculates a fixed monthly basic plus standard allowances based on calendar days. Daily wage payroll requires dynamic multiplication of actual verified duty shifts (Full/Half Day) and overtime hours worked on specific calendar dates, often disbursed daily or weekly in cash or direct UPI.

**Q3. How does the system ensure zero errors in cash and bank transfers?**
> *Answer:* The backend computes itemized totals and verifies payment constraints before writing immutable transaction records with unique transaction references (`TXN-...`). The printable salary voucher contains amounts in both numeric figures and full words (e.g., *"Eight Hundred and Twenty Rupees Only"*), along with dual signature lines for the accounts officer and worker thumb impression.

---

## 📂 Project Directory Structure

```
hospital-daily-wage-system/
├── package.json              # Root build & concurrent runner scripts
├── start.sh                  # One-click startup shell script
├── README.md                 # Complete documentation & viva reference
├── server/
│   ├── package.json          # Express, Mongoose, CORS, Dotenv
│   ├── server.js             # Main API gateway & route registry
│   ├── seed.js               # Standalone MongoDB database seeder
│   ├── config/
│   │   ├── db.js             # MongoDB connection configuration
│   │   └── smartStore.js     # Universal database & smart fallback layer
│   ├── models/
│   │   ├── Employee.js       # Daily wage staff model
│   │   ├── Attendance.js     # Shift attendance & overtime model
│   │   └── SalaryPayment.js  # Payment voucher & ledger model
│   ├── routes/
│   │   ├── employees.js      # Worker directory endpoints
│   │   ├── attendance.js     # Daily attendance endpoints
│   │   ├── salary.js         # Wage calculation & disbursal endpoints
│   │   └── stats.js          # Admin dashboard analytics
│   └── data/
│       └── hospital_db.json  # Persistent JSON datastore (SmartStore mode)
└── client/
    ├── package.json          # React, Vite, Lucide-React
    ├── vite.config.js        # Port 3000 with API proxy to port 5000
    ├── index.html            # Medical administration HTML wrapper
    └── src/
        ├── main.jsx          # React DOM entry point
        ├── App.jsx           # Master app state & navigation
        ├── index.css         # Styling & print voucher rules
        ├── services/
        │   └── api.js        # Centralized HTTP API client
        └── components/
            ├── Navbar.jsx            # Header & section navigation
            ├── DashboardStats.jsx    # Hospital workforce & liability overview
            ├── EmployeeManagement.jsx# Worker registration & ward assignment
            ├── AttendanceTracker.jsx # Daily shift roll-call & overtime logger
            ├── SalaryCalculator.jsx  # Wage calculator & payment disburser
            ├── PaymentHistory.jsx    # Audited transaction log
            └── SalarySlipModal.jsx   # Printable official hospital pay voucher
```

---
*Created for Hospital Administration Daily Wage Employee Payroll Management.*

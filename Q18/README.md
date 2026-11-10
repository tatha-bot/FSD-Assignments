# Q18: Employee Management & Directory System (MERN Stack)

> **Assignment / Practical Question Reference:**
> **Q18.** *Develop a web application for maintaining an Employee Management & Directory System using MERN Stack development with features to list, search, add, edit, and delete employee records.*

---

## 🌟 Project Overview
**EmployeeHub** is a production-grade full-stack MERN (MongoDB, Express.js, React, Node.js) web application designed for enterprise HR and operations teams to maintain, search, and manage staff records with real-time department filtering, salary statistics, and comprehensive CRUD capabilities.

### Key Capabilities
- 🔍 **Real-Time Live Search:** Search instantly across first name, last name, email, department, or job position.
- 🏢 **Department Filtering:** Interactive filter pills for Engineering, HR, Marketing, Finance, Design, Sales, and Operations.
- 📊 **Executive Metrics Banner:** Live computation of Total Staff, Active Employees, Average Annual Salary, and Department Counts.
- ➕ **Add Employee Modal:** Complete form with validation (first name, last name, work email, phone, department, designation, salary, status).
- ✏️ **Edit & Update Employee:** Modify employee roles, department transfers, salary increments, or leave status.
- 🗑️ **Delete Record:** Safe removal of employee records with confirmation.
- 👁️ **Employee Profile Card:** Modal dialog showing full employee details, hire date, and contact information.
- 🛡️ **Zero-Config Database Resilience:** Automatically connects to MongoDB when available; if MongoDB is not running locally, it activates an internal high-fidelity in-memory store so the app runs out-of-the-box immediately!

---

## 🛠️ Technology Stack

| Layer | Technology | Description |
|---|---|---|
| **Frontend** | React 18, Vite | Ultra-fast SPA with reactive state hooks |
| **Icons & UI** | Lucide React, Custom CSS | Modern corporate dashboard styling & responsive layout |
| **Backend** | Node.js, Express.js | Scalable REST API with structured controllers |
| **Database** | MongoDB & Mongoose | Document database with automatic in-memory fallback |
| **Tooling** | CORS, Dotenv | Cross-origin resource sharing & configuration management |

---

## 📂 Project Directory Structure

```text
Q18/
├── client/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Navbar.jsx              # Navigation & action triggers
│   │   │   ├── StatsCards.jsx          # KPI metrics banner
│   │   │   ├── EmployeeModal.jsx       # Add & Edit modal dialog
│   │   │   └── EmployeeDetailModal.jsx # Detailed employee profile card
│   │   ├── services/
│   │   │   └── api.js                  # Frontend REST API client
│   │   ├── App.jsx                     # Main application container
│   │   ├── index.css                   # Enterprise design system
│   │   └── main.jsx                    # React DOM entry point
│   ├── index.html                      # HTML root template
│   ├── package.json
│   └── vite.config.js                  # Vite configuration with /api proxy (Port 3002)
├── server/
│   ├── config/
│   │   └── db.js                       # MongoDB connection & fallback handler
│   ├── data/
│   │   ├── seedEmployees.js            # 8 pre-seeded realistic employee profiles
│   │   └── memoryStore.js              # High-fidelity in-memory fallback store
│   ├── models/
│   │   └── Employee.js                 # Mongoose schema for employees
│   ├── routes/
│   │   └── employees.js                # REST API routes (/api/employees)
│   ├── .env                            # Environment variables (Port 5002)
│   ├── package.json
│   └── server.js                       # Express server entry point
├── package.json                        # Root runner scripts
└── README.md                           # Documentation & execution guide
```

---

## 🚀 How to Run the Project

### Prerequisites
- **Node.js** (v18+ recommended)
- **npm** (v9+)
- *(Optional)* Local **MongoDB** instance or MongoDB Atlas. (The application runs seamlessly without MongoDB using its built-in in-memory store).

---

### Step 1: Open Terminal & Navigate to Q18
```bash
cd Q18
```

---

### Step 2: Start the Backend Server (Port 5002)

In terminal 1:
```bash
cd server
npm install
npm start
```

Expected output:
```text
======================================================
👔 Employee Management API running on http://localhost:5002
📦 Database: MongoDB (or In-Memory Store Fallback)
🔗 Health Check: http://localhost:5002/api/health
======================================================
```

---

### Step 3: Start the Frontend Application (Port 3002)

In terminal 2:
```bash
cd client
npm install
npm run dev
```

Expected output:
```text
  VITE v5.x.x  ready in 200 ms

  ➜  Local:   http://localhost:3002/
  ➜  Network: use --host to expose
```

Open your browser at:  
👉 **[http://localhost:3002](http://localhost:3002)**

---

## 📡 REST API Endpoints Reference

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/employees` | List employees (supports `?q=...`, `?department=...`, `?sort=...`) |
| `GET` | `/api/employees/stats` | Compute aggregate stats (total, avg salary, department counts) |
| `GET` | `/api/employees/:id` | Get single employee details |
| `POST` | `/api/employees` | Add a new employee |
| `PUT` | `/api/employees/:id` | Update employee information |
| `DELETE` | `/api/employees/:id` | Remove an employee record |
| `POST` | `/api/employees/seed` | Reset demo records to original 8 employees |
| `GET` | `/api/health` | Health check and database status |

---

## 🧪 Testing the Complete Workflow

1. **Browse & Search:**
   - Search for `"Engineer"` or `"Sharma"`. Results filter in real-time.
   - Click department pills (**Engineering**, **Marketing**, **Design**) to isolate teams.
2. **Add an Employee:**
   - Click **"Add Employee"** in the top navigation.
   - Fill in: First Name: `Aditi`, Last Name: `Sen`, Email: `aditi.sen@enterprise.com`, Department: `Design`, Position: `Senior UX Researcher`, Salary: `110000`.
   - Click **"Add Employee"**. The employee appears instantly and the stats update.
3. **Edit an Employee:**
   - Click the pencil icon on any employee row. Update their designation or salary and click **"Update Employee"**.
4. **Delete an Employee:**
   - Click the trash can icon on any employee row. Confirm the prompt to delete.

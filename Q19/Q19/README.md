# OpportunityHub — Full-Stack MERN Job & Vacancy Portal

A modern, production-grade **MERN Stack** (MongoDB, Express.js, React, Node.js) web application designed for maintaining an interactive job portal. It allows employers/recruiters to list open job vacancies and provides job seekers with a streamlined interface to search, inspect, and apply for open positions.

---

## 🌟 Key Features

### For Candidates / Job Seekers
- 🔍 **Browse & Filter Vacancies:**
  - Real-time search across job title, company name, and description.
  - Multi-attribute filtering: Category (*Engineering, Design, Marketing, Product, Sales, Support*), Job Type (*Full-time, Part-time, Remote, Contract, Internship*), and Location.
  - Sort vacancies by newest posted or highest number of available seats.
- 📋 **Detailed Vacancy View:**
  - Full role overview, key qualifications, benefits & perks, salary range, and vacancies count badge.
- 🚀 **Streamlined Application Form:**
  - Fast application modal: Name, Email, Phone, Years of Experience, Resume / Portfolio URL, and Cover Letter.
  - Form validation with immediate reference confirmation upon submission.

### For Employers & Recruiters
- ➕ **Post a New Vacancy:**
  - Publish open positions specifying job title, company, location, category, job type, available seats/vacancies, compensation, description, and requirements.
- 📊 **Recruiter Management Dashboard:**
  - **Manage Vacancies:** View active listings, open/closed status toggles, and deletion.
  - **Candidate Applications Tracker:** Review all applicants, contact info, experience level, and clickable resume/portfolio links.
  - **Status Workflow:** Update candidate application status (*Pending ➔ Reviewed ➔ Shortlisted ➔ Interview ➔ Hired / Rejected*).
- 🔄 **One-Click Demo Data:**
  - "Demo Data" button in the navigation bar to pre-populate realistic sample vacancies across tech, product, and design.

### 🛡️ Dual-Mode Database Support (Zero Configuration)
- **MongoDB Connected:** Full persistence using Mongoose models and queries.
- **In-Memory Store Fallback:** If local MongoDB is not running or not yet configured, the application automatically uses a resilient built-in in-memory store so the app runs and tests **out-of-the-box immediately** with zero setup errors!

---

## 🛠️ Technology Stack

| Layer | Technology | Description |
|---|---|---|
| **Frontend** | React 18, Vite | High-performance SPA with modern React hooks |
| **Styling** | Custom CSS3 & Design Tokens | Responsive layout, modern modal dialogs, and badges |
| **Icons** | Lucide React | Clean, lightweight UI icons |
| **Backend** | Node.js, Express.js | Scalable REST API with modular controllers and routes |
| **Database** | MongoDB & Mongoose | Flexible NoSQL document database with validation |
| **Tooling** | CORS, Morgan, Dotenv | Middleware for logging, cross-origin requests, and env management |

---

## 📂 Project Structure

```text
job-portal-mern/
├── backend/
│   ├── config/
│   │   └── db.js                 # MongoDB connection & fallback handler
│   ├── controllers/
│   │   ├── jobController.js      # Vacancy CRUD and search/filtering logic
│   │   └── applicationController.js # Job application submission & review
│   ├── models/
│   │   ├── Job.js                # Mongoose schema for job vacancies
│   │   └── Application.js        # Mongoose schema for job applications
│   ├── routes/
│   │   ├── jobRoutes.js          # /api/jobs endpoints
│   │   └── applicationRoutes.js  # /api/applications endpoints
│   ├── data/
│   │   ├── seedData.js           # 6 realistic sample vacancies
│   │   └── memoryStore.js        # Zero-config in-memory fallback store
│   ├── .env                      # Environment variables
│   ├── package.json
│   └── server.js                 # Main Express server entry point
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Navbar.jsx        # Navigation bar & status
│   │   │   ├── HeroBanner.jsx    # Hero section with live search & metrics
│   │   │   ├── JobCard.jsx       # Vacancy card with seats & tags
│   │   │   ├── JobDetailsModal.jsx # Detailed vacancy modal
│   │   │   ├── ApplyModal.jsx    # Candidate application form modal
│   │   │   ├── PostJobModal.jsx  # Recruiter post vacancy modal
│   │   │   └── RecruiterDashboard.jsx # Dashboard for vacancies & applicants
│   │   ├── services/
│   │   │   └── api.js            # Frontend API client
│   │   ├── App.jsx               # Main application container
│   │   ├── index.css             # Design system and styles
│   │   └── main.jsx
│   ├── index.html
│   ├── package.json
│   └── vite.config.js            # Vite configuration with /api proxy
├── package.json                  # Root runner scripts
└── README.md                     # Documentation & setup guide
```

---

## 🚀 How to Run the Application

### Prerequisites
- **Node.js** (v18 or higher recommended)
- **npm** (v9 or higher)
- *(Optional)* **MongoDB** installed locally OR a free [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) cluster connection string. *(If MongoDB is not installed, the app will automatically use its internal store).*

---

### Step 1: Open Terminal / Command Prompt
Navigate to the project root directory:
```bash
cd c:\Users\tatha\Downloads\job-portal-mern
```

---

### Step 2: Start the Backend Server

Open a terminal window and run:
```bash
cd backend
npm install
npm start
```

You should see output similar to:
```text
[MongoDB] Connected successfully (or In-Memory Store active)
==========================================
🚀 Job Portal API running on http://localhost:5000
📦 Database: MongoDB (or In-Memory Fallback)
🔗 Health Check: http://localhost:5000/api/health
==========================================
```

> **Note for Windows PowerShell users:** If script execution is restricted on your machine, you can run commands via `npm.cmd` or `cmd.exe /c "npm start"`.

---

### Step 3: Start the Frontend Application

Open a **second** terminal window and run:
```bash
cd frontend
npm install
npm run dev
```

You will see:
```text
  VITE v8.x.x  ready in 200 ms

  ➜  Local:   http://localhost:3000/
  ➜  Network: use --host to expose
```

Now open your web browser and navigate to:
👉 **[http://localhost:3000](http://localhost:3000)**

---

## ⚙️ Environment Variables (`backend/.env`)

The backend includes a pre-configured `.env` file:
```env
PORT=5000
MONGODB_URI=mongodb://127.0.0.1:27017/jobportal
NODE_ENV=development
```

### Using MongoDB Atlas (Cloud)
To connect to MongoDB Atlas, replace `MONGODB_URI` with your connection string:
```env
MONGODB_URI=mongodb+srv://<username>:<password>@cluster0.mongodb.net/jobportal?retryWrites=true&w=majority
```

---

## 📡 REST API Endpoints

### 1. Job Vacancies API (`/api/jobs`)
| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/jobs` | Get all vacancies (supports `search`, `category`, `jobType`, `location`, `status` query params) |
| `GET` | `/api/jobs/:id` | Get single vacancy details |
| `POST` | `/api/jobs` | Post a new job vacancy listing |
| `PUT` | `/api/jobs/:id` | Update an existing job vacancy |
| `DELETE` | `/api/jobs/:id` | Remove a job vacancy |
| `POST` | `/api/jobs/seed` | Reset & seed sample vacancy listings |

### 2. Applications API (`/api/applications`)
| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/applications` | Apply for a specific vacancy (`jobId`, `applicantName`, `applicantEmail`, `phone`, `experienceYears`, `resumeLink`, `coverLetter`) |
| `GET` | `/api/applications` | Retrieve applications (optional query `?jobId=<id>`) |
| `PATCH` | `/api/applications/:id/status` | Update candidate status (`Pending`, `Reviewed`, `Shortlisted`, `Interview`, `Hired`, `Rejected`) |

### 3. Health Check
| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/health` | Service status and database connection report |

---

## 🧪 Testing the Complete Workflow

1. **Browse Vacancies:**
   - On the homepage [http://localhost:3000](http://localhost:3000), search for `"React"` or `"Design"`, or click category pills like **Engineering** or **Marketing**.
2. **Apply for a Job:**
   - Click **"Apply Now"** on any vacancy card (e.g. *Senior Full Stack Engineer (MERN)*).
   - Fill in your Name, Email, Phone, Experience, and Resume URL. Click **"Submit Application"**.
   - Note the confirmation and Reference ID.
3. **Post a New Vacancy:**
   - Click the **"Post a Vacancy"** button in the top navigation bar.
   - Fill in Job Title, Company, Location, Job Type, Category, Available Seats (Vacancies Count), and Description.
   - Click **"Publish Vacancy Listing"**. The new job appears immediately at the top of the listings.
4. **Recruiter Dashboard:**
   - Click **"Recruiter Dashboard"** in the top navigation bar.
   - Go to **"Applicant Candidates"** to view the candidate application you just submitted.
   - Change the hiring status to **"Shortlisted"** or **"Interview"**.
   - Go to **"Manage Vacancies"** to toggle job status between *Open* and *Closed*, or delete listings.

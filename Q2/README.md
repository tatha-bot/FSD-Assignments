# Q2: Student Examination Registration & Attendance Eligibility (HTML, CSS, JavaScript)

## 📌 Problem Statement
Develop a client-side web application for **Student Examination Registration** that validates student details and checks eligibility based on class attendance.
- **Criteria:** Students must have at least **75% attendance** to be eligible to sit for the semester examination.
- **Input Fields:** Student Name, Register Number, Course Name, Attendance Percentage (0–100).
- **Validation:** Check for blank fields, attendance range boundaries (0-100), and display dynamic color-coded eligibility feedback (Green for eligible, Red for not eligible).

---

## 🛠️ Tech Stack
- **HTML5:** Semantic form inputs and layout structure
- **CSS3:** Modern card UI with responsive styling and soft shadows
- **JavaScript (Vanilla):** DOM manipulation, client-side input validation, and conditional eligibility logic

---

## 📂 File Structure
```
Q2/
└── 2/
    ├── index.html       # Student examination registration form
    ├── script.js        # Form validation and attendance eligibility logic
    └── style.css         # Styling for registration card and alerts
```

---

## 🚀 How to Run

### Option 1: Direct Browser Launch
1. Navigate to the `Q2/2` folder.
2. Double-click `index.html` to open it directly in any modern web browser (Google Chrome, Firefox, Edge, Safari).

### Option 2: Live Server / Python HTTP Server
```bash
# Navigate to the question directory
cd "Q2/2"

# Start a simple HTTP server using Python
python -m http.server 8080
```
Open your browser and navigate to:
```
http://localhost:8080
```

---

## 🧪 Test Cases
| Student Name | Register No | Course | Attendance | Expected Result |
| :--- | :--- | :--- | :--- | :--- |
| Alex Morgan | 2026CS101 | MCA | 82% | ✅ **Eligible** (Green alert: *Registration Successful! Eligible for Examination.*) |
| John Doe | 2026CS102 | MCA | 68% | ❌ **Not Eligible** (Red alert: *Registration Failed! Attendance is below 75%. Not Eligible.*) |
| Sarah Connor | 2026CS103 | MCA | 105% | ⚠️ **Invalid** (Red alert: *Attendance must be between 0 and 100.*) |
| Empty form | - | - | - | ⚠️ **Invalid** (Red alert: *Please fill all the fields.*) |

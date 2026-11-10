# Q3: Library Book Lending & Returning System (HTML, CSS, JavaScript)

## 📌 Problem Statement
Develop a client-side web application for a **College Library Management System** to handle book lending and returning operations with user input validation.
- **Criteria:** Only enrolled students aged between **18 and 30** years are permitted to lend or return library books.
- **Input Fields:** Student Name, Student ID, Student Age, Book Title, Operation (Lend / Return dropdown).
- **Validation:** Check for missing fields, validate student age within the allowed bracket (18–30), and output real-time transaction confirmation messages.

---

## 🛠️ Tech Stack
- **HTML5:** Form controls, dropdown selectors, and card layout
- **CSS3:** Clean minimalist styling with responsive layout
- **JavaScript (Vanilla):** Dynamic form validation, age boundary verification, and transaction status alerts

---

## 📂 File Structure
```
Q3/
└── 3/
    ├── index.html       # Library lending and returning form
    ├── script.js        # Form validation and age restriction logic
    └── style.css         # Styling for library portal interface
```

---

## 🚀 How to Run

### Option 1: Direct Browser Launch
1. Open the `Q3/3` folder.
2. Double-click `index.html` to open in any web browser.

### Option 2: Live Server / Python HTTP Server
```bash
python -m http.server 8080
```
Open your browser and navigate to:
```
http://localhost:8080
```

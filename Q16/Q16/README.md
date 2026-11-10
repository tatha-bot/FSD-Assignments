# Assignment 16: Candidate Job Interview Profile App using React JS

## Aim
To design and develop a responsive candidate profile web application using React JS that displays a job applicant's professional summary, technical skills with visual proficiency meters, academic background, project portfolio, and interview responses.

---

## Candidate Profile Sections
1. **Header & Contact Profile:**
   - Candidate Name: Tathagata Roy
   - Desired Role: Full Stack Web Developer
   - Interview Availability Status: Immediate Joiner
   - Contact Info: Email, Phone, Location (Bangalore, India), LinkedIn, and GitHub profiles.
2. **Professional Summary:**
   - Concise overview of technical capabilities across frontend, backend, and database technologies.
3. **Technical Competencies:**
   - Categorized skills (React JS, JavaScript, Node.js, PHP, MongoDB, MySQL, Git) with visual percentage progress bars.
4. **Academic & Technical Projects:**
   - University Centralised Data & Reporting Portal (Next.js, Prisma, PostgreSQL).
   - Course Registration & Examination Rank List System (PHP, MySQL, Bootstrap).
   - E-Commerce Inventory & Stock Management App (MongoDB, Node.js, Express).
5. **Education:**
   - Bachelor of Technology (B.Tech) in Computer Science & Engineering (CGPA: 8.7/10.0).
   - Higher Secondary Certificate (12th Standard - Science, 91.4%).
6. **Interview Q&A:**
   - Common interview preparation questions and structured candidate answers.

---

## React Component Architecture
- **State Hook (`useState`):**
  - `activeTab`: Controls which section panel (`overview`, `skills`, `projects`, `education`, `interview`) is rendered dynamically upon button selection.
- **Component Styling (`App.css`):**
  - Dark mode aesthetic with high-contrast text typography.
  - Flexbox and CSS Grid layout for responsiveness across mobile and desktop viewports.
  - Gradient progress bars and interactive status tags.

---

## Project Structure
```
Q16/
├── package.json          # Node.js project manifest
├── server.js             # Local Node.js server
├── index.html            # Standalone browser bundle
├── public/
│   └── index.html        # Public template
├── src/
│   ├── App.js            # Main Profile component with tab routing
│   ├── App.css           # Styling and responsive layout rules
│   └── index.js          # DOM rendering entrypoint
└── README.md             # Lab report documentation
```

---

## How to Run

### Method 1: Direct Browser Launch
Open `index.html` in any web browser.

### Method 2: Node.js Server
1. Navigate to the `Q16` directory:
   ```bash
   cd Q16
   ```
2. Start the local server:
   ```bash
   node server.js
   ```
3. Open your browser at:
   ```
   http://localhost:3002
   ```

---

## Result
A candidate job interview profile web application was constructed in React JS, successfully rendering interactive tabs for profile overview, technical skills, projects, and educational qualifications.

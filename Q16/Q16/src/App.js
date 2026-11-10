import React, { useState } from 'react';
import './App.css';

const candidateData = {
  name: "Tathagata Roy",
  targetRole: "Full Stack Web Developer",
  status: "Available for Immediate Interview",
  avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80",
  contact: {
    email: "tathagata.dev@email.com",
    phone: "+91 98765 43210",
    location: "Bangalore, India",
    linkedin: "linkedin.com/in/tathagata-dev",
    github: "github.com/Tathagata2022"
  },
  summary: "Motivated Full Stack Web Developer with a strong academic foundation in Computer Science and hands-on experience building production-grade web applications using React JS, Node.js, PHP, and MongoDB/MySQL. Passionate about developing responsive user interfaces, designing scalable REST APIs, and writing clean, maintainable code.",
  skills: [
    { name: "React JS", level: 90, category: "Frontend" },
    { name: "JavaScript (ES6+)", level: 88, category: "Frontend" },
    { name: "HTML5 / CSS3 / Bootstrap", level: 92, category: "Frontend" },
    { name: "Node.js & Express", level: 82, category: "Backend" },
    { name: "PHP & REST APIs", level: 85, category: "Backend" },
    { name: "MongoDB & Mongoose", level: 84, category: "Database" },
    { name: "MySQL / SQL", level: 86, category: "Database" },
    { name: "Git & GitHub Version Control", level: 90, category: "Tools" }
  ],
  education: [
    {
      degree: "Bachelor of Technology (B.Tech) in Computer Science & Engineering",
      institution: "Central University / Institute of Technology",
      period: "2022 - 2026",
      grade: "CGPA: 8.7 / 10.0",
      highlights: "Core Coursework: Data Structures, Database Management Systems, Web Technologies, Computer Networks, Operating Systems."
    },
    {
      degree: "Higher Secondary Certificate (12th Standard - Science)",
      institution: "State Higher Secondary Board",
      period: "2020 - 2022",
      grade: "Percentage: 91.4%",
      highlights: "Majors in Physics, Chemistry, and Mathematics."
    }
  ],
  projects: [
    {
      title: "Centralised University Academic Data & Reporting Portal",
      tech: "Next.js, Prisma ORM, PostgreSQL, NextAuth, TypeScript",
      description: "Architected a multi-role administrative platform for 50+ university departments to submit, scrutinize (HoD/Authority), and export annual NAAC/NIRF reporting data to PDF and Excel."
    },
    {
      title: "Course Registration & Examination Rank List System",
      tech: "PHP, MySQL, Apache, Bootstrap 5",
      description: "Developed end-semester examination evaluation and course enrollment modules calculating student ranks (Gold/Silver/Bronze) with real-time academic metric dashboards."
    },
    {
      title: "E-Commerce Shop Inventory & Stock Management App",
      tech: "MongoDB, Node.js, Express, HTML5",
      description: "Engineered an inventory control system executing atomic stock updates ($inc), customer sales deductions with non-negative stock guards, and automated low-stock reorder alerts."
    }
  ],
  interviewNotes: [
    {
      question: "Why should we hire you for this role?",
      answer: "I bring hands-on full-stack development capability spanning React frontend and Node/PHP backend, coupled with strong problem-solving skills and a proven track record of delivering end-to-end web projects."
    },
    {
      question: "What are your key technical strengths?",
      answer: "Component-driven UI development in React, designing normalized relational and document databases (MySQL/MongoDB), and building secure RESTful APIs."
    },
    {
      question: "Where do you see yourself in 3 years?",
      answer: "Growing into a Senior Full Stack Engineer, mentoring junior engineers, and architecting scalable cloud-native web systems."
    }
  ]
};

function App() {
  const [activeTab, setActiveTab] = useState('overview');

  return (
    <div className="profile-container">
      {/* Header Card */}
      <div className="profile-header-card">
        <div className="header-flex">
          <img
            src={candidateData.avatar}
            alt={candidateData.name}
            className="avatar-img"
          />
          <div className="header-info">
            <div className="status-badge">{candidateData.status}</div>
            <h1 className="candidate-name">{candidateData.name}</h1>
            <p className="candidate-role">{candidateData.targetRole}</p>
            <div className="contact-pills">
              <span>&#9993; {candidateData.contact.email}</span>
              <span>&#9742; {candidateData.contact.phone}</span>
              <span>&#128205; {candidateData.contact.location}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="tabs-nav">
        <button
          className={`tab-btn ${activeTab === 'overview' ? 'active' : ''}`}
          onClick={() => setActiveTab('overview')}
        >
          Overview
        </button>
        <button
          className={`tab-btn ${activeTab === 'skills' ? 'active' : ''}`}
          onClick={() => setActiveTab('skills')}
        >
          Technical Skills
        </button>
        <button
          className={`tab-btn ${activeTab === 'projects' ? 'active' : ''}`}
          onClick={() => setActiveTab('projects')}
        >
          Projects
        </button>
        <button
          className={`tab-btn ${activeTab === 'education' ? 'active' : ''}`}
          onClick={() => setActiveTab('education')}
        >
          Education
        </button>
        <button
          className={`tab-btn ${activeTab === 'interview' ? 'active' : ''}`}
          onClick={() => setActiveTab('interview')}
        >
          Interview Q&A
        </button>
      </div>

      {/* Tab Content Panels */}
      <div className="content-card">
        {/* 1. OVERVIEW */}
        {activeTab === 'overview' && (
          <div className="tab-pane">
            <h3 className="section-title">Professional Summary</h3>
            <p className="lead-text">{candidateData.summary}</p>

            <h3 className="section-title" style={{ marginTop: '24px' }}>Quick Candidate Highlights</h3>
            <div className="highlights-grid">
              <div className="highlight-box">
                <span className="hl-number">3+</span>
                <span className="hl-label">Full Stack Projects</span>
              </div>
              <div className="highlight-box">
                <span className="hl-number">8.7</span>
                <span className="hl-label">B.Tech CGPA</span>
              </div>
              <div className="highlight-box">
                <span className="hl-number">React & Node</span>
                <span className="hl-label">Core Tech Stack</span>
              </div>
              <div className="highlight-box">
                <span className="hl-number">Immediate</span>
                <span className="hl-label">Availability</span>
              </div>
            </div>
          </div>
        )}

        {/* 2. TECHNICAL SKILLS */}
        {activeTab === 'skills' && (
          <div className="tab-pane">
            <h3 className="section-title">Technical Competencies</h3>
            <div className="skills-grid">
              {candidateData.skills.map((skill, i) => (
                <div key={i} className="skill-card">
                  <div className="skill-meta">
                    <span className="skill-name">{skill.name}</span>
                    <span className="skill-pct">{skill.level}%</span>
                  </div>
                  <div className="progress-track">
                    <div className="progress-fill" style={{ width: `${skill.level}%` }}></div>
                  </div>
                  <span className="skill-category">{skill.category}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 3. PROJECTS */}
        {activeTab === 'projects' && (
          <div className="tab-pane">
            <h3 className="section-title">Academic & Technical Projects</h3>
            <div className="projects-list">
              {candidateData.projects.map((proj, i) => (
                <div key={i} className="project-card">
                  <div className="proj-header">
                    <h4>{proj.title}</h4>
                  </div>
                  <div className="tech-badge">{proj.tech}</div>
                  <p className="proj-desc">{proj.description}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 4. EDUCATION */}
        {activeTab === 'education' && (
          <div className="tab-pane">
            <h3 className="section-title">Academic Background</h3>
            <div className="education-list">
              {candidateData.education.map((edu, i) => (
                <div key={i} className="edu-card">
                  <div className="edu-header">
                    <h4>{edu.degree}</h4>
                    <span className="edu-period">{edu.period}</span>
                  </div>
                  <div className="edu-inst">{edu.institution}</div>
                  <div className="edu-grade">{edu.grade}</div>
                  <p className="edu-notes">{edu.highlights}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 5. INTERVIEW Q&A */}
        {activeTab === 'interview' && (
          <div className="tab-pane">
            <h3 className="section-title">Candidate Interview Readiness</h3>
            <div className="qa-list">
              {candidateData.interviewNotes.map((qa, i) => (
                <div key={i} className="qa-box">
                  <div className="qa-question">
                    <span className="q-tag">Q:</span> {qa.question}
                  </div>
                  <div className="qa-answer">
                    <span className="a-tag">A:</span> {qa.answer}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;

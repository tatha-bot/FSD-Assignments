require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { connectDB, getStatus } = require('./config/db');
const employeesRouter = require('./routes/employees');

const app = express();

app.use(cors());
app.use(express.json());

// Health Check
app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'online',
    service: 'Employee Directory & Management API (MERN)',
    database: getStatus() ? 'MongoDB Connected' : 'In-Memory Store (Zero-Config Active)',
    timestamp: new Date().toISOString()
  });
});

// Root Information Route
app.get('/', (req, res) => {
  res.send(`
    <html>
      <head><title>Employee Directory API</title></head>
      <body style="font-family: system-ui, sans-serif; padding: 40px; line-height: 1.6; max-width: 650px; margin: auto;">
        <h2>👔 Employee Management REST API (MERN)</h2>
        <p>The backend service is running.</p>
        <ul>
          <li><strong>Employees API:</strong> <a href="/api/employees">/api/employees</a></li>
          <li><strong>Stats API:</strong> <a href="/api/employees/stats">/api/employees/stats</a></li>
          <li><strong>Health Check:</strong> <a href="/api/health">/api/health</a></li>
        </ul>
        <p>Database: <strong>${getStatus() ? 'MongoDB Connected' : 'In-Memory Store (Fallback)'}</strong></p>
      </body>
    </html>
  `);
});

app.use('/api/employees', employeesRouter);

// 404
app.use((req, res) => {
  res.status(404).json({ success: false, message: `Route not found: ${req.originalUrl}` });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error('Server error:', err);
  res.status(500).json({ success: false, error: err.message || 'Internal Server Error' });
});

const PORT = process.env.PORT || 5002;

const startServer = async () => {
  await connectDB();
  app.listen(PORT, () => {
    console.log(`\n======================================================`);
    console.log(`👔 Employee Management API running on http://localhost:${PORT}`);
    console.log(`📦 Database: ${getStatus() ? 'MongoDB' : 'In-Memory Store (Fallback)'}`);
    console.log(`🔗 Health Check: http://localhost:${PORT}/api/health`);
    console.log(`======================================================\n`);
  });
};

startServer();

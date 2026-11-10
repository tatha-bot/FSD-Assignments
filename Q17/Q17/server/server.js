const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');

// Load environment variables
dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
const employeesRouter = require('./routes/employees');
const attendanceRouter = require('./routes/attendance');
const salaryRouter = require('./routes/salary');
const statsRouter = require('./routes/stats');

app.use('/api/employees', employeesRouter);
app.use('/api/attendance', attendanceRouter);
app.use('/api/salary', salaryRouter);
app.use('/api/stats', statsRouter);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ONLINE',
    service: 'Hospital Administration Daily Wage Salary Management System',
    timestamp: new Date().toISOString()
  });
});

// Root friendly welcome
app.get('/', (req, res) => {
  res.send(`
    <div style="font-family: sans-serif; padding: 40px; text-align: center; background: #f0fdf4; color: #166534; border-radius: 12px; margin: 40px auto; max-width: 600px;">
      <h2>🏥 Hospital Administration - Daily Wage Management API</h2>
      <p>Backend Server is running successfully on port ${process.env.PORT || 5000}.</p>
      <p><a href="/api/stats" style="color: #15803d; font-weight: bold;">View System Stats API &rarr;</a></p>
      <p><a href="/api/employees" style="color: #15803d; font-weight: bold;">View Daily Wage Staff API &rarr;</a></p>
    </div>
  `);
});

const PORT = process.env.PORT || 5000;

// Start server after attempting DB connection
connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`=======================================================`);
    console.log(`🏥 Hospital Daily Wage Salary System Server Started!`);
    console.log(`🚀 Running at: http://localhost:${PORT}`);
    console.log(`📡 API Endpoints:`);
    console.log(`   - http://localhost:${PORT}/api/employees`);
    console.log(`   - http://localhost:${PORT}/api/attendance`);
    console.log(`   - http://localhost:${PORT}/api/salary/calculate`);
    console.log(`   - http://localhost:${PORT}/api/salary/payments`);
    console.log(`   - http://localhost:${PORT}/api/stats`);
    console.log(`=======================================================`);
  });
});

require("dotenv").config();
const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const { connectDB, getStatus } = require("./config/db");

const jobRoutes = require("./routes/jobRoutes");
const applicationRoutes = require("./routes/applicationRoutes");

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

// Health check and root route
app.get("/api/health", (req, res) => {
  res.status(200).json({
    status: "online",
    service: "MERN Job Portal API",
    database: getStatus() ? "MongoDB connected" : "In-Memory Store active (zero config)",
    timestamp: new Date().toISOString(),
  });
});

app.get("/", (req, res) => {
  res.send(`
    <html>
      <head><title>Job Portal API</title></head>
      <body style="font-family: system-ui, sans-serif; padding: 40px; line-height: 1.6; max-width: 700px; margin: auto;">
        <h2>🚀 MERN Job Portal REST API</h2>
        <p>The backend server is active and running.</p>
        <ul>
          <li><strong>Jobs API:</strong> <a href="/api/jobs">/api/jobs</a></li>
          <li><strong>Applications API:</strong> <a href="/api/applications">/api/applications</a></li>
          <li><strong>Health Check:</strong> <a href="/api/health">/api/health</a></li>
        </ul>
        <p>DB Status: <strong>${getStatus() ? "MongoDB Connected" : "In-Memory Store (Fallback)"}</strong></p>
      </body>
    </html>
  `);
});

// API Routes
app.use("/api/jobs", jobRoutes);
app.use("/api/applications", applicationRoutes);

// 404 Handler
app.use((req, res) => {
  res.status(404).json({ success: false, message: `Route not found: ${req.originalUrl}` });
});

// Global Error Handler
app.use((err, req, res, next) => {
  console.error("Unhandled API Error:", err);
  res.status(500).json({
    success: false,
    message: err.message || "Internal Server Error",
  });
});

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  await connectDB();
  app.listen(PORT, () => {
    console.log(`\n==========================================`);
    console.log(`🚀 Job Portal API running on http://localhost:${PORT}`);
    console.log(`📦 Database: ${getStatus() ? "MongoDB" : "In-Memory Fallback"}`);
    console.log(`🔗 Health Check: http://localhost:${PORT}/api/health`);
    console.log(`==========================================\n`);
  });
};

startServer();

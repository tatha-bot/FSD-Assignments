require("dotenv").config();
const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const { connectDB, getStatus } = require("./config/db");

const accountRoutes = require("./routes/accountRoutes");
const transactionRoutes = require("./routes/transactionRoutes");

const app = express();

app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

app.get("/api/health", (req, res) => {
  res.status(200).json({
    status: "online",
    system: "TrustBank MERN Savings Account Management System",
    database: getStatus() ? "MongoDB Connected" : "In-Memory Secure Bank Store",
    timestamp: new Date().toISOString(),
  });
});

app.get("/", (req, res) => {
  res.send(`
    <html>
      <head><title>TrustBank Savings API</title></head>
      <body style="font-family: system-ui, sans-serif; padding: 40px; line-height: 1.6; max-width: 650px; margin: auto;">
        <h2>🏦 TrustBank Savings Account REST API</h2>
        <p>Backend banking service is active and running.</p>
        <ul>
          <li><strong>Accounts API:</strong> <a href="/api/accounts">/api/accounts</a></li>
          <li><strong>Transactions API:</strong> <a href="/api/transactions">/api/transactions</a></li>
          <li><strong>Health Check:</strong> <a href="/api/health">/api/health</a></li>
        </ul>
        <p>Database: <strong>${getStatus() ? "MongoDB Connected" : "In-Memory Ledger (Fallback)"}</strong></p>
      </body>
    </html>
  `);
});

app.use("/api/accounts", accountRoutes);
app.use("/api/transactions", transactionRoutes);

app.use((req, res) => {
  res.status(404).json({ success: false, message: `Route not found: ${req.originalUrl}` });
});

app.use((err, req, res, next) => {
  console.error("Unhandled API Error:", err);
  res.status(500).json({ success: false, message: err.message || "Internal Server Error" });
});

const PORT = process.env.PORT || 5001;

const startServer = async () => {
  await connectDB();
  app.listen(PORT, () => {
    console.log(`\n======================================================`);
    console.log(`🏦 TrustBank Savings API running on http://localhost:${PORT}`);
    console.log(`🔒 Genuine Account Holder Authentication & KYC Active`);
    console.log(`📦 Database: ${getStatus() ? "MongoDB" : "In-Memory Store"}`);
    console.log(`======================================================\n`);
  });
};

startServer();

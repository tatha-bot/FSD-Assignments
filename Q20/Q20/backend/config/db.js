const mongoose = require("mongoose");

let isMongoConnected = false;

const connectDB = async () => {
  const uri = process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/savingsbank";
  try {
    const conn = await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 2500,
    });
    isMongoConnected = true;
    console.log(`[MongoDB] Connected successfully to Bank DB: ${conn.connection.host}`);
    return true;
  } catch (error) {
    isMongoConnected = false;
    console.warn(`[MongoDB Warning] Could not connect to MongoDB at "${uri}".`);
    console.warn(`[MongoDB Info] Activating In-Memory Bank Ledger so deposit/withdrawal tests run immediately.`);
    console.warn(`[MongoDB Tip] To persist data permanently, start mongod or configure MONGODB_URI in backend/.env`);
    return false;
  }
};

const getStatus = () => isMongoConnected;

module.exports = { connectDB, getStatus };

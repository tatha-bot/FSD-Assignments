const mongoose = require("mongoose");

let isMongoConnected = false;

const connectDB = async () => {
  const uri = process.env.MONGO_URI || process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/employeeDB";
  try {
    const conn = await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 2500,
    });
    isMongoConnected = true;
    console.log(`[MongoDB] Connected successfully: ${conn.connection.host}/${conn.connection.name}`);
    return true;
  } catch (error) {
    isMongoConnected = false;
    console.warn(`[MongoDB Warning] Could not connect to MongoDB at "${uri}".`);
    console.warn(`[MongoDB Info] Activated Zero-Config In-Memory Store so the app works immediately.`);
    console.warn(`[MongoDB Tip] To persist data permanently, start mongod or set MONGO_URI in server/.env`);
    return false;
  }
};

const getStatus = () => isMongoConnected;

module.exports = { connectDB, getStatus };

const mongoose = require("mongoose");

let isMongoConnected = false;

const connectDB = async () => {
  const uri = process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/jobportal";
  try {
    const conn = await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 2500, // Quick timeout so it falls back gracefully if no local mongo daemon
    });
    isMongoConnected = true;
    console.log(`[MongoDB] Connected successfully: ${conn.connection.host}`);
    return true;
  } catch (error) {
    isMongoConnected = false;
    console.warn(`[MongoDB Warning] Could not connect to MongoDB at "${uri}".`);
    console.warn(`[MongoDB Info] Falling back to high-fidelity In-Memory Store so the app runs immediately.`);
    console.warn(`[MongoDB Tip] To persist data to MongoDB, start your local mongod or set MONGODB_URI=<your_atlas_url> in backend/.env`);
    return false;
  }
};

const getStatus = () => isMongoConnected;

module.exports = { connectDB, getStatus };

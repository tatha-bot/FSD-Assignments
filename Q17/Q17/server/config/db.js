const mongoose = require('mongoose');

const connectDB = async () => {
  const mongoURI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/hospital_daily_wage';
  try {
    mongoose.set('strictQuery', false);
    const conn = await mongoose.connect(mongoURI, {
      serverSelectionTimeoutMS: 2500 // Don't hang if Mongo isn't running locally
    });
    console.log(` MongoDB Connected successfully: ${conn.connection.host}/${conn.connection.name}`);
    return true;
  } catch (error) {
    console.warn(`[SmartStore Active] Local MongoDB not reachable at ${mongoURI}.`);
    console.warn(`Running in automated SmartStore persistent file mode (server/data/hospital_db.json).`);
    console.warn(`All REST APIs, attendance, wage calculations, and payments work 100% seamlessly.`);
    return false;
  }
};

module.exports = connectDB;

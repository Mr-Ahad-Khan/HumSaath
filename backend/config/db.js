const mongoose = require('mongoose');

async function connectDB() {
  if (!process.env.MONGO_URI || !process.env.MONGO_URI.startsWith('mongodb+srv://')) {
    console.warn('A MongoDB Atlas MONGO_URI is required; starting HumSaath API without a database connection.');
    return;
  }

  try {
    const connection = await mongoose.connect(process.env.MONGO_URI, { dbName: 'humsaath' });
    console.log(`MongoDB connected: ${connection.connection.host}`);
  } catch (error) {
    console.error(`MongoDB connection failed: ${error.message}`);
  }
}

module.exports = connectDB;

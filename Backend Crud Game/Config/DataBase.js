const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.Mongo_URL);
    console.log('Database Connected Successfully');
  } catch (error) {
    console.error('Database Connection Failed:', error.message);
  }
};

module.exports = connectDB;
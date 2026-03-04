const mongoose = require('mongoose');

const dotenv = require('dotenv');
dotenv.config();

const MongoURL = process.env.Mongo_URL;
const connectDB = () => {
  mongoose
    .connect(MongoURL)
    .then(() => {
      console.log('DataBase Connected SuccessFully');
    })
    .catch((err) => {
      console.log(`Error occur in this :  ${err.message}`);
    });
};
module.exports = connectDB;

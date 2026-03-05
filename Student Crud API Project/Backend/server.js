const express = require('express');
const app = express();
const connectDB = require('./Config/connection.js');
const StudentRoutes = require('./Routes/StudentRoutes.js');
const cors = require('cors');
const path = require('path');
// Connection To Server
connectDB();

// MiddleWare
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.use('./Uploads', express.static(path.join(__dirname, './Uploads')));

//Cors
app.use(cors());

// Routes
app.use('/api/students', StudentRoutes);
app.use((error, req, res, next) => {
  if (error instanceof MulterError) {
    return res.status(400).send(`Image Error: ${error.message} : ${error.code}`);
  } else if (error) {
    return res.status(500).send(`Something went wrong: ${error.message}`);
  }
  next();
});

// Server
const PORT = process.env.PORT;

app.listen(PORT, () => {
  console.log(`Your Project is Running on ${PORT}`);
});

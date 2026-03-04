const express = require('express');
const app = express();
const connectDB = require('./Config/connection.js');
const StudentRoutes = require('./Routes/StudentRoutes.js')

// Connection To Server
connectDB();


// MiddleWare
app.use(express.urlencoded({ extended: false }));
app.use(express.json());


// Routes 
app.use('/api/students',StudentRoutes);


// Server
const PORT = process.env.PORT;

app.listen(PORT, () => {
  console.log(`Your Project is Running on ${PORT}`);
});

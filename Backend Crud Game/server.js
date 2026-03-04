const express = require('express');
const app = express();
const ContactRouter = require('./Routes/ContactsRoute.js');
const connectDB = require('./Config/DataBase.js');

//Connection To DataBase
connectDB();

//MiddleWare
app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: false }));
app.use(express.static('public'));

//Routes
app.use('/', ContactRouter);


// Connection To Server

const PORT = process.env.PORT

app.listen(PORT, () => {
  console.log(`Your Project is Running on PORT Number ${PORT}`);
});

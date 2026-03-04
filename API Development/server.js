const express = require('express');
const app = express();
const dotenv = require('dotenv');
dotenv.config();

// MiddleWare






// Server
 const PORT = process.env.PORT

app.listen(PORT,()=>{
    console.log(`Your Project is Running on ${PORT}`);
})
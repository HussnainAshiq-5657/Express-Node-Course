const express = require('express');
const app = express();
const cookieParser = require('cookie-parser');
const csrf = require('csurf');
const dotenv = require('dotenv');
dotenv.config();
 

// MiddleWare

app.use(express.urlencoded({extended:false}));
app.use(express.json());
app.set('view engine','ejs');

app.use(cookieParser());
const csrfProtection = csrf({cookie:true})

// Routes
 
app.get('/form',csrfProtection,(req,res)=>{
  res.render('form',{csrfToken:req.csrfToken()})
})

app.post('/submit',csrfProtection,(req,res)=>{
  res.send(req.body);
})


// Server

const PORT = process.env.PORT;

app.listen(PORT, () => {
  console.log(`Your Project is Running on PORT ${PORT}`);
});

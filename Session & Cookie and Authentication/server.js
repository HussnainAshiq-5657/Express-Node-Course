// const express = require('express');
// const app = express();
// const dotenv = require('dotenv');
// const session = require('express-session');
// const MongoStore = require('connect-mongo').default || require('connect-mongo');
// const bcrypt = require('bcryptjs');
// const mongoose = require('mongoose');
// const UserModel = require('./Models/UserModels.js');
// dotenv.config();

// app.use(express.urlencoded({ extended: false }));
// app.use(express.json());
// app.set('view engine', 'ejs');

// app.use(
//   session({
//     secret: 'ali5656',
//     resave: false,
//     saveUninitialized: false,
//     store: MongoStore.create({
//       mongoUrl: 'mongodb://127.0.0.1:27017/SessionDB',
//     }),
//     cookie: { maxAge: 1000 * 60 * 60 * 24 },
//   })
// );

// app.use(
//   session({
//     secret: 'ali5656',
//     resave: false,
//     saveUninitialized: false,
//   })
// );

// // DataBase Connection

// mongoose
//   .connect('mongodb://127.0.0.1:27017/PersonCrud')
//   .then(() => console.log('Mongo Connected SuccessFully..'))
//   .catch((err) => console.log('Mongo Error:', err));

// app.get('/home', (req, res) => {
//   res.send(`<h1>Home Page</h1> ${res.session.user}`);
// });
// app.get('/login', (req, res) => {
//   res.render('login', { error: null });
// });
// app.get('/register', (req, res) => {
//   res.render('register', { error: null });
// });

// app.post('/register', async (req, res) => {
//   const { username, userpassword } = req.body;
//   const handledPassword = await bcrypt.hash(userpassword, 10);

//   // res.send({username,userpassword:handledPassword});

//   await UserModel.create({ username, userpassword: handledPassword });
//   res.redirect('/login');
// });

// app.post('/login', async (req, res) => {
//   const { username, userpassword } = req.body;

//   const user = await UserModel.findOne({ username });
//   if (!user) {
//     res.render('login', { error: 'User not found' });
//   }
//   const isMatch = await bcrypt.compare(userpassword, user.userpassword);
//   if (!isMatch) {
//     res.render('login', { error: 'Invalid Password' });
//   } else {
//      req.session.user = username
//     res.redirect('/home');
//   }
// });

// app.get('/', (req, res) => {
//   if (req.session.name) {
//     res.send(`<h1>Session has been Created with name : ${req.session.name}</h1>`);
//   } else {
//     res.send('<h1>Session has not been Created</h1>');
//   }
// });
// app.get('/username', (req, res) => {
//   req.session.name = 'Hamza';
//   res.send('<h1>UserName has been sent in Session.</h1>');
// });
// app.get('/getName', (req, res) => {
//   if (req.session.name) {
//     res.send(`<h1>Session has been Created with name : ${req.session.name}</h1>`);
//   } else {
//     res.send('<h1>Session has not been Created</h1>');
//   }
// });

// app.get('/about', (req, res) => {
//   req.session.destroy((err) => {
//     if (err) {
//       res.status(500).send('<h1>Error Occured in Deletion of Session</h1>');
//     } else {
//       res.send('<h1>Session Deleted Successfullly..</h1>');
//     }
//   });
// });
// app.get('/logout', (req, res) => {
//   req.session.destroy(() => {
//     res.redirect('/login');
//   });
// });


// const PORT = process.env.PORT;

// app.listen(PORT, () => {
//   console.log(`Your Server is Running on PORT ${PORT}`);
// });


const express = require('express');
const app = express();
const session = require('express-session')
const bcrypt = require('bcryptjs')
const mongoose = require('mongoose')
const User = require('./Models/UserModels')

//Database Connection
mongoose.connect('mongodb://127.0.0.1/EmployeeCrud')
.then(() => console.log('Connected!'))

//Middleware
app.use(express.urlencoded({ extended: false }))
app.use(express.json());
app.set("view engine", "ejs");

app.use(session({
  secret : 'secret123',
  resave: false,
  saveUninitialized: false
}))

let checkLogin = (req,res,next) => {
  if(req.session.user){
    next()
  }else{
    res.redirect('login')
  }
}

// Routes
app.get('/',checkLogin, (req, res) => {
  res.send(`<h1>Home Page</h1> 
    <p>Hello, ${req.session.user}</p>
    <a href="/logout">Logout</a>
    `);
});

app.get('/profile',checkLogin, (req, res) => {
  res.send(`<h1>Profile Page</h1>
    <p>Hello, ${req.session.user}</p>
    <a href="/logout">Logout</a>
    `);
});


app.get('/login', (req, res) => {
  if(req.session.user){
    res.redirect('/')
  }else{
    res.render('login',{ error: null});
  }
  
});

app.get('/register', (req, res) => {
  res.render('register',{ error: null});
});

app.post('/register',async (req, res) => {
  const {username, userpassword} = req.body
  const hasedPassword = await bcrypt.hash(userpassword, 10)

  // res.send({username, userpassword: hasedPassword })
  await User.create({username, userpassword: hasedPassword})
  res.redirect('/login')
})

app.post('/login',async (req, res) => {
  const {username, userpassword} = req.body

  const user = await User.findOne({username})
  if(!user) return res.render('login', { error: 'User not found'})

  const isMatch = await bcrypt.compare(userpassword, user.userpassword)
  if(!isMatch) return res.render('login', { error: 'Invalid Password'})

    req.session.user = username
    res.redirect('/')
})

app.get('/logout', (req, res) => {
  req.session.destroy(() => {
    res.redirect('/login')
  })
})

app.listen(3000, () => {
  console.log('Server running on port 3000');
});
// const dotenv = require('dotenv');
// dotenv.config();

// const middleware = (res, req, next) => {
//   const ali = new Date();
//   console.log(`Your date is ${ali.getDate()} and time is ${ali.getTimezoneOffset()}`);
//   console.log('Application Level MiddleWare');
//   next();
// };

// app.get('/', (req, res) => {
//   res.send('<h1>Welcome to Home Page</h1>');
// });
// app.use(middleware);
// app.get('/about', (req, res) => {
//   res.send('<h1>Welcome to About Page</h1>');
// });

// Connection to Server

const express = require('express');
const multer = require('multer');
const app = express();
const { body, validationResult } = require('express-validator');
const path = require('path');

app.set('view engine', 'ejs');
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

var validationRegistration = [
  body('username')
    .notEmpty()
    .withMessage('Username is required.')
    .isLength({ min: 3 })
    .withMessage('Username must be at least 3 characters long.')
    .trim()
    .isAlpha()
    .withMessage('Username must contain only letters.')
    .custom((value) => {
      if (value === 'admin') {
        throw new Error('Username "admin" is not allowed.');
      }
      return true;
    })
    .customSanitizer((value) => value.toLowerCase()),
  body('useremail').isEmail().withMessage('Please provide a valid Email Id.').normalizeEmail(),
  body('userpass')
    .isLength({ min: 5, max: 10 })
    .withMessage('Password must be between 5 and 10 character long.')
    .isStrongPassword()
    .withMessage('Password must be strong.'),
  body('userage')
    .isNumeric()
    .withMessage('Age must be numeric.')
    .isInt({ min: 18 })
    .withMessage('Age must be at least 18 years old.'),
  body('usercity')
    .isIn(['Delhi', 'Mumbai', 'Goa', 'Agra'])
    .withMessage('City must be Delhi, Mumbai, Goa or Agra.'),
];

app.get('/', (req, res) => {
  res.render('myForm', { errors: 0 });
});

app.post('/saveForm', validationRegistration, (req, res) => {
  const error = validationResult(req);
  if (error.isEmpty()) {
    res.send(req.body);
  }

  res.render('myForm', { errors: error.array() });
});

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, './Uploads');
  },
  filename: (req, file, cb) => {
    const fileName = Date.now() + path.extname(file.originalname);
    cb(null, fileName);
  },
});

const fileFilter = (req, file, cb) => {
  if (file.fieldname === 'userFile') {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only Images Files are Allowed..'), false);
    }
  } else if (file.fieldname === 'userDocuments') {
    if (file.mimetype === 'application/pdf') {
      cb(null, true);
    } else {
      cb(new Error('Only Pdf Files are Allowed..'), false);
    }
  } else {
    cb(new Error('Unknown Filed.'), false);
  }
};

const upload = multer({
  storage,
  limits: {
    fileSize: 1024 * 1024 * 5,
  },
  fileFilter,
});

app.get('/multer', (req, res) => {
  res.render('multerForm');
});

app.post(
  '/SubmitForm',
  upload.fields([
    {
      name: 'userFile',
      maxCount: 1,
    },
    {
      name: 'userDocuments',
      maxCount: 3,
    },
  ]),
  (req, res) => {
    if (!req.files || req.files.length === 0) {
      res.status(400).send('No File Submitted......');
    }
    res.send(req.file);
  }
);

app.use((error, req, res, next) => {
  if (error instanceof multer.MulterError) {
    if (error.code === 'LIMIT_UNEXPECTED_FILE') {
      res.status(400).send('Too Many Files Uploaded.');
    }
    res.status(400).send(`Multer Error : ${error.message} : ${error.code}`);
  } else {
    res.status(500).send(`Something Went Wrong : ${error.message}`);
  }
  next();
});

app.listen(3000, () => {
  console.log('Express Server starts on port 3000!');
});

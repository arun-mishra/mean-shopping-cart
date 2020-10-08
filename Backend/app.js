const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
// const csrf = require('csurf');
const multer = require('multer');
const { v4: uuidv4 } = require('uuid');

const errorController = require('./controllers/error');
const User = require('./models/user');

const MONGODB_URI =
  'mongodb+srv://Arun_Mishra:arun3040@cluster0.oxbb0.mongodb.net/MEAN_Shop?retryWrites=true&w=majority';

const app = express();

const fileStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'images');
  },
  filename: (req, file, cb) => {
    console.log(file)
    console.log('filename =',file.filename)
    cb(null, uuidv4() + '-' + file.originalname);
  }
});

const fileFilter = (req, file, cb) => {
  if (
    file.mimetype === 'image/png' ||
    file.mimetype === 'image/jpg' ||
    file.mimetype === 'image/jpeg'
  ) {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');
const authRoutes = require('./routes/auth');

app.use((req,res,next)=>{
  res.setHeader('Access-Control-Allow-Origin','*');
  res.setHeader('Access-Control-Allow-Methods','PUT,GET,POST,DELETE,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers','*');
  next()
})
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }));

app.use(
  multer({ storage: fileStorage, fileFilter: fileFilter }).single('image')
);
app.use(express.static(path.join(__dirname, 'public')));
app.use('/images', express.static(path.join(__dirname, 'images')));


// app.use(csrfProtection);

// app.use((req, res, next) => {
//   res.locals.isAuthenticated = req.session.isLoggedIn;
//   res.locals.adminAuthenticated = req.session.adminAuthenticated;
//   res.locals.csrfToken = req.csrfToken();
//   next();
// });

// app.use((req, res, next) => {
//   // throw new Error('Sync Dummy');
//   // if (!req.session.user) {
//   //   return next();
//   // }
//   User.findById(req.userId)
//     .then(user => {
//       console.log(user)
//       if (!user) {
//         return next();
//       }
//       req.user = user;
//       next();
//     })
//     .catch(err => {
//       next(new Error(err));
//     });
// });


app.use(shopRoutes);
app.use('/auth',authRoutes);
app.use('/admin', adminRoutes);

// app.get('/500', errorController.get500);

// app.use(errorController.get404);

// app.use((error, req, res, next) => {
//   // res.status(error.httpStatusCode).render(...);
//   // res.redirect('/500');
//   console.log(error)
//   res.status(500).render('500', {
//     pageTitle: 'Error!',
//     path: '/500',
//     isAuthenticated: req.session.isLoggedIn
//   });
// });

mongoose
  .connect(MONGODB_URI)
  .then(result => {
    app.listen(process.env.PORT || 8080);
  })
  .catch(err => {
    console.log("error=",err);
  });

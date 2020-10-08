// const express = require('express');
// const { check, body } = require('express-validator/check');

// const authController = require('../controllers/auth');
// const User = require('../models/user');
// const Admin = require('../models/admin')

// const router = express.Router();

// // router.get('/login', authController.getLogin);

// // router.get('/adminLogin', authController.getAdminLogin);

// // router.get('/signup', authController.getSignup);




// // router.post(
// //   '/login',
// //   [
// //     body('email')
// //       .isEmail()
// //       .withMessage('Please enter a valid email address.')
// //       .normalizeEmail(),
// //     body('password', 'Password has to be valid.')
// //       .isLength({ min: 5 })
// //       .isAlphanumeric()
// //       .trim()
// //   ],
// //   authController.postLogin
// // );
// // router.post(
// //   '/adminLogin',
// //   [
// //     body('email')
// //       .isEmail()
// //       .withMessage('Please enter a valid email address.')
// //       .normalizeEmail(),
// //     body('password', 'Password has to be valid.')
// //       .isLength({ min: 5 })
// //       .isAlphanumeric()
// //       .trim()
// //   ],
// //   authController.postAdminLogin
// // );

// router.post(
//   '/signup',
//   [
//     check('email')
//       .isEmail()
//       .withMessage('Please enter a valid email.')
//       .custom((value, { req }) => {
       
//         return User.findOne({ email: value }).then(userDoc => {
//           if (userDoc) {
//             return Promise.reject(
//               'E-Mail exists already, please pick a different one.'
//             );
//           }
//         });
//       })
//       .normalizeEmail(),
//     body(
//       'password',
//       'Please enter a password with only numbers and text and at least 5 characters.'
//     )
//       .isLength({ min: 5 })
//       .isAlphanumeric()
//       .trim()
//     // body('confirmPassword')
//     //   .trim()
//     //   .custom((value, { req }) => {
//     //     if (value !== req.body.password) {
//     //       throw new Error('Passwords have to match!');
//     //     }
//     //     return true;
//     //   })
//   ],
//   authController.postSignup
// );

// // router.post('/logout', authController.postLogout);

// // router.get('/reset', authController.getReset);

// // router.post('/reset', authController.postReset);

// // router.get('/reset/:token', authController.getNewPassword);

// // router.post('/new-password', authController.postNewPassword);

// module.exports = router;


const express = require('express');

const router = express.Router();

const {check,body} = require('express-validator/check')

const authController = require('../controllers/auth');

const isAuth = require('../middleware/is-Auth');

const isAdminAuth = require('../middleware/is-Admin-Auth');

router.post('/signup',[
    body('email').isEmail(),
    body('password').isLength({min:8})
],authController.signup)

router.post('/login',[
    body('email').isEmail(),
    body('password').isLength({min:8})
],authController.login)

router.post('/admin',[
  body('email').isEmail(),
  body('password').isLength({min:8})
],authController.admin)

router.get('/verifyUserToken',isAuth,authController.verifyUserToken);
router.get('/verifyAdminToken',isAdminAuth,authController.verifyAdminToken);

module.exports = router;
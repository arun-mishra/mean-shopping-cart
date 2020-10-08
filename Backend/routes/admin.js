const path = require('path');

const express = require('express');
const { body } = require('express-validator/check');

const adminController = require('../controllers/admin');
// const isAuth = require('../middleware/is-auth');
const isAdmin = require('../middleware/is-Admin-Auth')

const router = express.Router();

// // /admin/add-product => GET
// router.get('/add-product', isAuth,isAdmin,adminController.getAddProduct);

// // /admin/products => GET
router.get('/products',isAdmin,adminController.getProducts);

// // /admin/bookings => GET
router.get('/bookings',isAdmin,adminController.getBookings)
// // /admin/add-product => POST
router.post(
  '/add-product',
  [
    body('title')
      .isString()
      .isLength({ min: 3 })
      .trim(),
    body('price').isFloat(),
    body('description')
      .isLength({ min: 5, max: 400 })
      .trim()
  ],isAdmin,
  adminController.postAddProduct
);

// router.get('/edit-product/:productId',isAuth,isAdmin, adminController.getEditProduct);

router.get('/getProduct/:productId',isAdmin,adminController.getProduct);

router.get('/bookings',isAdmin,adminController.getBookings)

router.post(
  '/edit-product',
  [
    body('title')
      .isString()
      .isLength({ min: 3 })
      .trim(),
    body('price').isFloat(),
    body('description')
      .isLength({ min: 5, max: 400 })
      .trim()
  ],
  isAdmin,
  adminController.postEditProduct
);

router.delete('/product/:productId', isAdmin, adminController.deleteProduct);

module.exports = router;

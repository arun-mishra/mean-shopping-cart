const mongoose = require('mongoose');
const fileHelper = require('../util/file');
const { validationResult } = require('express-validator/check');
const Product = require('../models/product');
const Admin = require('../models/admin');
const Order = require('../models/order');
const ITEMS_PER_PAGE = 10;
const ORDERS_PER_PAGE = 10;



exports.postAddProduct = (req, res, next) => {
  const title = req.body.title;
  const image = req.body.image
  //const image = req.file;
  const price = req.body.price;
  const description = req.body.description;
  Admin.findById(req.adminId)
  .then(admin=>{
    if(!admin){
      return res.redirect('/')
    }
    if(req.adminId !== admin._id.toString() ) {
      return res.redirect('/')
    }

    // if (!image) {
    //     console.log('not found image')
    //   return res.status(422).json('Attached file is not an image.')
    // }
    const errors = validationResult(req);
  
    if (!errors.isEmpty()) {
      console.log(errors.array());
      return res.status(422).json(errors.array()[0].msg,)
    }
   // const imageUrl = image.path;
    const product = new Product({
      title: title,
      price: price,
      description: description,
      imageUrl:image,
      //imageUrl: imageUrl,
      userId: req.adminId
    });
    product
      .save()
      .then(result => {
        console.log('Created Product');
        return res.status(201).json(result)
      })
  })
    .catch(err => {
      console.log(err)
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
};

exports.getProduct = (req, res, next) => {

  const prodId = req.params.productId;
  Product.findById(prodId)
    .then(product => {
      if (!product) {
        return res.redirect('/');
      }
      return res.status(200).json(product)
    })
    .catch(err => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
};

exports.postEditProduct = (req, res, next) => {
  const prodId = req.body.productId;
  const updatedTitle = req.body.title;
  const updatedPrice = req.body.price;
  const updatedImage = req.body.image
  //const image = req.file;
  const updatedDesc = req.body.description;

  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(422).json(errors.array()[0].msg)
  }

  Product.findById(prodId)
    .then(product => {
      if (product.userId.toString() !== req.adminId.toString()) {
        return res.status(401).json('You are not admin!!!')
      }
      if(!product){
          return res.status(404).json('Product not found!!!')
      }
      console.log(product)
      product._id = prodId;
      product.title = updatedTitle;
      product.price = updatedPrice;
      product.description = updatedDesc;
      product.image = updatedImage
      // if (image) {
      //   fileHelper.deleteFile(product.imageUrl);
      //   product.imageUrl = image.path;
      // }
      return product.save()
      .then(result => {
          console.log(result);
        console.log('UPDATED PRODUCT!');
        res.status(201).json(result)
      });
    })
    .catch(err => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
};

exports.getProducts = (req, res, next) => {

  const page = +req.query.page || 1
  console.log(+req.query.page);
  let totalItems;
  Product.find({userId:req.adminId})
    .countDocuments()
    .then(numProducts => {
      totalItems = numProducts;
      return Product.find({userId:req.adminId})
        .skip((page - 1) * ITEMS_PER_PAGE)
        .limit(ITEMS_PER_PAGE);
    })
    .then(products => {
      res.status(200).json({
            products:products,
            currentPage: page,
            hasNextPage: ORDERS_PER_PAGE * page < totalItems,
            hasPreviousPage: page > 1,
            nextPage: page + 1,
            previousPage: page - 1,
            lastPage: Math.ceil(totalItems / ORDERS_PER_PAGE)
      });
    })

    .catch(err => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
};

exports.deleteProduct = (req, res, next) => {
  const prodId = req.params.productId;
  Product.findById(prodId)
    .then(product => {
      if (!product) {
        return next(new Error('Product not found.'));
      }
      // fileHelper.deleteFile(product.imageUrl);
      // console.log(product.imageUrl);
      return Product.deleteOne({ _id: prodId, userId: req.adminId });
    })
    .then(() => {
      console.log('DESTROYED PRODUCT');
      res.status(200).json({ message: 'Success!' });
    })
    .catch(err => {
      res.status(500).json({ message: 'Deleting product failed.' });
    });
};

exports.getBookings = (req,res,next)=>{

  const page = +req.query.page || 1
  console.log(+req.query.page);
  let totalItems;
  Order.find()
    .countDocuments()
    .then(numOrder => {
      totalItems = numOrder;
     
      return Order.aggregate([
        { "$unwind": "$products"},
        { "$unwind": "$products.product"},
        { "$group": {"_id":{
          "_id":"$_id",
          "title": "$products.product.title",
          "price": "$products.product.price",
          "userId": "$user.userId",
          "quantity":"$products.quantity",
          "Total": {"$multiply": [ '$products.product.price', '$products.quantity' ]} 
        }
       },
      }
        ])
        .skip((page - 1) * ORDERS_PER_PAGE)
        .limit(ORDERS_PER_PAGE);
    })
    .then(orders => {
      res.status(200).json({
            orders:orders,
            currentPage: page,
            hasNextPage: ORDERS_PER_PAGE * page < totalItems,
            hasPreviousPage: page > 1,
            nextPage: page + 1,
            previousPage: page - 1,
            lastPage: Math.ceil(totalItems / ORDERS_PER_PAGE)
      });
    })
  .catch(err => {
    const error = new Error(err);
    error.httpStatusCode = 500;
    return next(error);
  });
}

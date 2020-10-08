const fs = require('fs');
const path = require('path');
const stripe = require('stripe')('sk_test_51HI8Q3CqPaATR62WAdW6hKsAJzftI6NmbS75fc9lQCHTcfDctVRegP0nugEvr6ebUccSJR7LTII4V7MK8uFFhYts00p3VSgv66');

const PDFDocument = require('pdfkit');

const Product = require('../models/product');
const User = require('../models/user');
const Order = require('../models/order');
const ITEMS_PER_PAGE = 2;

//exports.getProducts = (req, res, next) => {
//   const page = +req.query.page || 1;
//   let totalItems;

//   Product.find()
//     .countDocuments()
//     .then(numProducts => {
//       totalItems = numProducts;
//       return Product.find()
//         .skip((page - 1) * ITEMS_PER_PAGE)
//         .limit(ITEMS_PER_PAGE);
//     })
//     .then(products => {
//       res.render('shop/product-list', {
//         prods: products,
//         pageTitle: 'Products',
//         path: '/products',
//         currentPage: page,
//         hasNextPage: ITEMS_PER_PAGE * page < totalItems,
//         hasPreviousPage: page > 1,
//         nextPage: page + 1,
//         previousPage: page - 1,
//         lastPage: Math.ceil(totalItems / ITEMS_PER_PAGE)
//       });
//     })
//     .catch(err => {
//       const error = new Error(err);
//       error.httpStatusCode = 500;
//       return next(error);
//     });
// };

// exports.getProduct = (req, res, next) => {
//   const prodId = req.params.productId;
//   Product.findById(prodId)
//     .then(product => {
//       res.render('shop/product-detail', {
//         product: product,
//         pageTitle: product.title,
//         path: '/products'
//       });
//     })
//     .catch(err => {
//       const error = new Error(err);
//       error.httpStatusCode = 500;
//       return next(error);
//     });
// };

exports.getIndex = (req, res, next) => {
  const page = +req.query.page || 1
  console.log(+req.query.page);
  let totalItems;
  Product.find()
    .countDocuments()
    .then(numProducts => {
      totalItems = numProducts;
      return Product.find()
        .skip((page - 1) * ITEMS_PER_PAGE)
        .limit(ITEMS_PER_PAGE);
    })
    .then(products => {
      res.status(201).json({
            products:products,
            currentPage: page,
            hasNextPage: ITEMS_PER_PAGE * page < totalItems,
            hasPreviousPage: page > 1,
            nextPage: page + 1,
            previousPage: page - 1,
            lastPage: Math.ceil(totalItems / ITEMS_PER_PAGE),
            totalItems:totalItems
      });
    })
    .catch(err => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
};

exports.getCart = (req, res, next) => {
    User.findById(req.userId)
    .then(user=>{
        if(!user){
            return
        }
        
       return  req.user = user;
       
    })
    .then(users=>{
      
      //console.log(users)
      req.user
      .populate('cart.items.productId')
      .execPopulate()
      .then(user => {
        
        const products = user.cart.items;
        console.log(products)
        return res.status(200).json(products)
    })

  
    })
    .catch(err => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
};

exports.postCart = (req, res, next) => {
    console.log('testing!!!')
  const prodId = req.body._id;
  console.log(prodId)
  User.findById(req.userId)
  .then(user=>{
      if(!user){
          return
      }
      req.user = user
  })
  .catch(err=>{
      console.log(err);
  })
  Product.findById(prodId)
    .then(product => {
        console.log(product)
      return req.user.addToCart(product);
    })
    .then(result => {
      console.log(result);
      res.status(201).json(result);
    })
    .catch(err => {
        console.log(err)
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
};

exports.postCartDeleteProduct = (req, res, next) => {
  const prodId = req.body.productId;
  console.log(prodId)
  User.findById(req.userId)
  .then(user=>{
    //console.log(user)
    if(!user){
      return
    }
    return req.user = user
  })
  .then(user=>{
    user
    .removeFromCart(prodId)
    .then(result => {
      res.status(200).json(result);
    })
  })
 
    .catch(err => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
};

exports.getCheckout = (req, res, next) => {
  let products;
  let total = 0;
  let userId = req.userId
  User.findById(req.userId)
  .then(user=>{
    if(!user){
      return
    }
    return req.user = user;
  })
  .then(user=>{
    req.user
    .populate('cart.items.productId')
    .execPopulate()
    .then(user => {

      products = user.cart.items;
      console.log(products)
      total = 0;
      products.forEach(p => {
        total += p.quantity * p.productId.price;
        console.log(total)
      });
      return stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        line_items: products.map(p => {
          return {
            name: p.productId.title,
            description: p.productId.description,
            amount: p.productId.price * 100,
            currency: 'usd',
            quantity: p.quantity
          };
        }),
        success_url: 'http://localhost:4200/checkout/'+userId, // => http://localhost:3000
        cancel_url: req.protocol + '://' + req.get('host') + '/checkout/cancel'
      });
    })
    .then(session => {
      //console.log(session)
      res.status(200).json({products:products,totalSum:total,sessionId:session.id}) 
    })
  })
    
    .catch(err => {
      console.log(err)
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
};

exports.getCheckoutSuccess = (req, res, next) => {
  let userId = req.params.userId
 User.findById(userId)
 .then(user=>{
   if(!user){
     return
   }
   return req.user = user;
 })
 .then(user=>{
   console.log(user)
   user
  .populate('cart.items.productId')
  .execPopulate()
  .then(user => {
    const products = user.cart.items.map(i => {
      return { quantity: i.quantity, product: { ...i.productId._doc } };
    });
    console.log(products)
    const order = new Order({
      user: {
        email: req.user.email,
        userId: req.user
      },
      products: products
    });
    return order.save();
  })
  .then(result => {
    return req.user.clearCart();
  })
  .then(() => {
    res.status(201).json('Success!!!')
  })
   
  })
    .catch(err => {
      console.log(err)
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
};

// exports.postOrders = (req, res, next) => {
//   User.findById(req.userId)
//   .then(user=>{
//     if(!user){
//       return
//     }
//     return req.user = user
//   })
//   .then(user=>{
//     req.user
//     .populate('cart.items.productId')
//     .execPopulate()
//     .then(user => {
//       const products = user.cart.items.map(i => {
//         return { quantity: i.quantity, product: { ...i.productId._doc } };
//       });
//       const order = new Order({
//         user: {
//           email: req.user.email,
//           userId: req.user
//         },
//         products: products
//       });
//       return order.save();
//     })
//     .then(result => {
//       return req.user.clearCart();
//     })
//     .then(() => {
//       res.json('Success!!')
//     })
//   })

//     .catch(err => {
//       const error = new Error(err);
//       error.httpStatusCode = 500;
//       return next(error);
//     });
// };

exports.getOrders = (req, res, next) => {
  Order.find({ 'user.userId': req.userId })
    .then(orders => {
      res.status(200).json(orders)
    })
    .catch(err => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
};

exports.getInvoice = (req, res, next) => {
  const orderId = req.params.orderId;
  Order.findById(orderId)
    .then(order => {
      if (!order) {
        return next(new Error('No order found.'));
      }
      if (order.user.userId.toString() !== req.userId.toString()) {
        return next(new Error('Unauthorized'));
      }
      const invoiceName = 'invoice-' + orderId + '.pdf';
      const invoicePath = path.join('data', 'invoices', invoiceName);

      const pdfDoc = new PDFDocument();
      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader(
        'Content-Disposition',
        'inline; filename="' + invoiceName + '"'
      );
      pdfDoc.pipe(fs.createWriteStream(invoicePath));
      pdfDoc.pipe(res);

      pdfDoc.fontSize(26).text('Invoice', {
        underline: true
      });
      pdfDoc.text('-----------------------');
      let totalPrice = 0;
      order.products.forEach(prod => {
        totalPrice += prod.quantity * prod.product.price;
        pdfDoc
          .fontSize(14)
          .text(
            prod.product.title +
              ' - ' +
              prod.quantity +
              ' x ' +
              '$' +
              prod.product.price
          );
      });
      pdfDoc.text('---');
      pdfDoc.fontSize(20).text('Total Price: $' + totalPrice);

      pdfDoc.end();
      // fs.readFile(invoicePath, (err, data) => {
      //   if (err) {
      //     return next(err);
      //   }
      //   res.setHeader('Content-Type', 'application/pdf');
      //   res.setHeader(
      //     'Content-Disposition',
      //     'inline; filename="' + invoiceName + '"'
      //   );
      //   res.send(data);
      // });
      // const file = fs.createReadStream(invoicePath);

      // file.pipe(res);
    })
    .catch(err => next(err));
};

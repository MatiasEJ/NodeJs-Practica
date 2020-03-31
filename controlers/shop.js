const Product = require('../model/product');
const Order = require('../model/order');
const fs = require('fs');
const path = require('path');
const PDFDocument = require('pdfkit')

exports.getIndex = (req, res, next) => {
  Product.find()
    .then(products => {
      res.render('shop/index', {
        prods: products,
        pageTitle: 'Shop',
        path: '/',
         
      });
    })
    .catch(err => {
      console.log(err);
    });
};
exports.getProducts = (req, res, next) => {
  Product.find()
    .then(products => {
     
      res.render('shop/product-list', {
        prods: products,
        pageTitle: 'All Products',
        path: '/products',
         
      });
    })
    .catch(err => {
      console.log(err);
    });
};

exports.getProduct = (req, res, next) => {
  const prodId = req.params.productId;
  Product.findById(prodId)
    .then(product => {
      res.render('shop/product-detail', {
        product: product,
        pageTitle: product.title,
        path: '/products',
         
      });
    })
    .catch(err => console.log(err));
};


exports.getCart = (req, res, next) => {
  req.user
    .populate('cart.items.productId')
    .execPopulate()
    .then(user => {
      const products = user.cart.items;
      res.render('shop/cart', {
        path: '/cart',
        pageTitle: 'Your Cart',
        products: products,
         
      });
    })
    .catch(err => console.log(err));
};

exports.postCart = (req, res, next) => {
  const prodId = req.body.productId;
  Product.findById(prodId)
    .then(product => {
      return req.user.addToCart(product);
    })
    .then(result => {
      res.redirect('/products');
    });
};

exports.postCartDeleteProduct = (req, res, next) => {
  const prodId = req.body.productId;
  req.user
    .deleteItemFromCart(prodId)
    .then(result => {
      res.redirect('/cart');
    })
    .catch(err => console.log(err));
};

exports.postOrder = (req, res, next) => {
  req.user
    .populate('cart.items.productId')
    .execPopulate()
    .then(user => {
      const products = user.cart.items.map(i => {
        return { quantity: i.quantity, product: { ...i.productId._doc } };
      });
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
      res.redirect('/orders');
    })
    .catch(err => console.log(err));
};

exports.getOrders = (req, res, next) => {
  Order.find({ 'user.userId': req.user._id })
    .then(orders => {
      res.render('shop/orders', {
        path: '/orders',
        pageTitle: 'Your Orders',
        orders: orders,
         
      });
    })
    .catch(err => console.log(err));
};


exports.getInvoice = (req, res, next) => {
  
  const orderId = req.params.orderId;
  Order.findById(orderId)
  .then(order=>{
    if (!order){
      return next(new Error("No order"))
    }
    if (order.user.userId.toString() !== req.user._id.toString()) {
      return next(new Error("No Acces"))
    }

    const invoiceName = 'invoice-'+orderId+'.pdf';
    const invoicePath = path.join('data', invoiceName)

    const pdfDoc = new PDFDocument();
    res.setHeader('Content-Type','application/pdf')
    res.setHeader(
      'Content-Disposition',
      'inline; filename="'+invoiceName+'"'
    );
    pdfDoc.pipe(fs.createWriteStream(invoicePath));
    pdfDoc.pipe(res);
    let totalCompras = 0; 

    pdfDoc.fontSize(26).text('INVOICE:')
    pdfDoc.fontSize(26).text('--------------------------------------------------');
    order.products.forEach(prod => {
      totalCompras += prod.product.price * prod.quantity; 
      pdfDoc
      .fontSize(14)
      .text(`
      Producto: ${prod.product.title}(${prod.product.price})
      Cantidad: ${prod.quantity} Total Producto: ${prod.quantity*prod.product.price}
      `);
    });
    pdfDoc.fontSize(14).text(`Total: ${totalCompras}`)


    pdfDoc.end();
    // const file = fs.createReadStream(invoicePath);
    // res.setHeader('Content-Type','application/pdf')
    // res.setHeader(
    //   'Content-Disposition',
    //   'attachment; filename="'+invoiceName+'"'
    // );

    // file.pipe(res);

    // fs.readFile(invoicePath, (err, data)=>{
    // if (err){
    //   return next(err);
    // }
    // res.setHeader('Content-Type','application/pdf')
    // res.setHeader('Content-Disposition','attachment; filename="'+invoiceName+'"')
    // res.send(data);

  // })

  })
  .catch(err=>next(err))

  
}
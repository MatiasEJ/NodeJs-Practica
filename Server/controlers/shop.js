const Product = require('../model/product');

exports.getProducts = (req, res, next) => {
  Product.fetchAll(products=>{
        res.render('shop/product-list',{
            prods: products,
            pageTitle: 'All Products', 
            path:'/products'
        });
    
    });    

};
exports.getProduct = (req, res, next) => {
    const prodId = req.params.productId;
    Product.findById(prodId, product =>{
        console.log(product);
    });
    res.redirect('/');
  
  };

exports.getIndex = (req, res, next) => {
    Product.fetchAll(products=>{
        res.render('shop/index',{
            prods: products,
            pageTitle: 'shop', 
            path:'/'
        });
    });    

};

exports.getCart = (req, res, next) => {
    res.render('shop/cart',{ 
            path:'/cart',
            pageTitle: 'YourCart'
        });    

};

exports.getOrders = (req, res, next) => {
    res.render('shop/orders',{ 
            path:'/orders',
            pageTitle: 'YourOrders'
        });    

};
exports.getcheckout = (req, res, next) => {
    res.render('shop/checkout',{ 
            path:'/checkout',
            pageTitle: 'Yourcheckout'
        });    

};
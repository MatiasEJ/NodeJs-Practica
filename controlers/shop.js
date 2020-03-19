const Product = require('../model/product');
const Cart = require('../model/cart')


exports.getProducts = (req, res, next) => {
  Product.fetchAll()
    .then( products=>{
        res.render('shop/product-list',{
            prods: products,
            pageTitle: 'All Products', 
            path:'/products'
            
        });
    
    }).catch(err=>console.log(err));    

};
exports.getProduct = (req, res, next) => {
    const prodId = req.params.productId;
    Product.findById(prodId)
    .then(product =>{
        res.render('shop/product-detail',{
            product: product, 
            pageTitle: product.title,
            path: '/products'
        });
    }).catch((e)=>console.log("Error en obtener producto:",e))
    
    
  
  };

exports.getIndex = (req, res, next) => {
    Product.fetchAll().then(products=>{
        res.render('shop/index',{
            prods: products,
            pageTitle: 'shop', 
            path:'/'
        });
    });    

};

exports.getCart = (req, res, next) => {
    req.user
    .getCart()
    .then(products=>{
            console.log("Productos",products)
            res.render('shop/cart',{ 
                path:'/cart',
                pageTitle: 'YourCart',
                products: products
            });  
        })
        .catch(err=>console.log("error en obtener productos",err));
};

exports.postCart= (req,res,next) =>{
    const prodId = req.body.productId;
    
    
    Product.findById(prodId)
    .then(product =>{
        return req.user.addToCart(product);
    }).then(result => {

        res.redirect('/cart')
    }).catch(err=>console.log("<= ERROR EN CARRO =>",err));
    
};

exports.postCartDelete = (req,res,next) => {
    const prodId = req.body.productId;
  
    Product.findById(prodId,product =>{
        Cart.deleteProduct(prodId,product.price);
        res.redirect('/cart');
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
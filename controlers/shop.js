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
    Product.findById(prodId, product =>{
        res.render('shop/product-detail',{
            product: product, 
            pageTitle: product.title,
            path: '/products'
        });
    });
    
    
  
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
    Cart.getCart(cart => {
        let cartTotal = parseInt(cart.totalPrice);
        console.log(cartTotal);
        Product.fetchAll(products =>{
            const cartProducts = [];
            
            for(product of products){
                const cartProdData = cart.products.find(prod => prod.id === product.id);
                if(cartProdData){
                    cartProducts.push({productData: product, qty: cartProdData.qty});
                }
            }
            res.render('shop/cart',{ 
                path:'/cart',
                pageTitle: 'YourCart',
                products: cartProducts,
                cartTotal: cartTotal
            });  
        });
    });
     

};

exports.postCart= (req,res,next) =>{
    const prodId = req.body.productId;
    Product.findById(prodId,(product) =>{
        Cart.addProduct(prodId, product.price,product.title);
    })
    res.redirect('/cart');
};

exports.postCartDelete = (req,res,next) => {
    const prodId = req.body.productId;
    console.log(prodId);
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
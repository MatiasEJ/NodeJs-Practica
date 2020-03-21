const Product = require('../model/product');



exports.getProducts = (req, res, next) => {
  Product.find()
    .then( products=>{
      console.log(products)
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
    Product.find().then(products=>{
        res.render('shop/index',{
            prods: products,
            pageTitle: 'shop', 
            path:'/'
        });
    });   
};

// exports.getCart = (req, res, next) => {
//     req.user
//     .getCart()
//     .then(products=>{
           
//             res.render('shop/cart',{ 
//                 path:'/cart',
//                 pageTitle: 'YourCart',
//                 products: products
//             });  
//         })
//         .catch(err=>console.log("error en obtener productos",err));
// };

// exports.postCart= (req,res,next) =>{
//     const prodId = req.body.productId;
//     Product.findById(prodId)
//     .then(product =>{
//         return req.user.addToCart(product);
//     }).then(result => {

//         res.redirect('/cart')
//     }).catch(err=>console.log("<= ERROR EN CARRO =>",err));
    
// };

// exports.postCartDelete = (req,res,next) => {
//     const prodId = req.body.productId;
//     req.user
//     .deleteItemFromCart(prodId)
//     .then(result => {
//         console.log("borrado satisfactorio")
//         res.redirect('/cart')
//     })
//     .catch(err=>console.log("<= ERROR Borrado =>",err));
    

// };

// exports.postOrder = (req,res,next) =>{
    
//     req.user
//     .addOrder()
//     .then(result =>{
        
//         res.redirect('/orders');   
//     })
//     .catch( err => console.log(err) );
// }


// exports.getOrder = (req, res, next) => {
//     req.user
//     .getOrders()
//     .then(orders=>{
//         res.render('shop/orders',{ 
//             path:'/orders',
//             pageTitle: 'Your Orders!!',
//             orders: orders
//         });    

//     })
//     .catch(err=>console.log("Error en obtener orders: ", err))
    
// };
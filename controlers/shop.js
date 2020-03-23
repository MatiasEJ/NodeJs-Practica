const Product = require('../model/product');
const Order = require('../model/order');



exports.getProducts = (req, res, next) => {
  Product.find()
    .then( products=>{
      console.log("en LISTA DE PRODUCTOS")
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

exports.getCart = (req, res, next) => {
    req.user
    .populate('cart.items.productId')
    .execPopulate()
    .then(user=>{
           const products = user.cart.items;
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
        res.redirect('/products')
    }).catch(err=>console.log("<= ERROR EN CARRO =>",err));
    
};

exports.postCartDelete = (req,res,next) => {
    const prodId = req.body.productId;
    req.user
    .deleteItemFromCart(prodId)
    .then(result => {
        console.log("borrado satisfactorio")
        res.redirect('/cart')
    })
    .catch(err=>console.log("<= ERROR Borrado =>",err));
    

};

exports.postOrder = (req,res,next) =>{
    req.user
    .populate('cart.items.productId')
    .execPopulate()
    .then(user=>{
           const products = user.cart.items.map(i =>{
               return {quantity: i.quantity, product: {...i.productId._doc}}
           });
           const order = new Order({
                user: {
                    name: req.user.name,
                    userId: req.user
                },
                products: products
            });

            return order.save();
    })
    .then(result =>{
        return req.user.clearCart()
         
    })
    .then(result =>{
        res.redirect('/orders');  
    })
    .catch( err => console.log("error en posTORder",err) );
}


exports.getOrder = (req, res, next) => {
    Order.find({"user.userId": req.user._id}).then(orders=>{
        res.render('shop/orders',{ 
            path:'/orders',
            pageTitle: 'Your Orders!!',
            orders: orders
        });    

    })
    .catch(err=>console.log("Error en obtener orders: ", err))
    
    
};
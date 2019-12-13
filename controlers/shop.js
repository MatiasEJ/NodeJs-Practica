const Product = require('../model/product');
const Cart = require('../model/cart')



exports.getProducts = (req, res, next) => {
    
    Product.findAll()
    .then(products=>{
        res.render('shop/product-list',{
            prods: products,
            pageTitle: 'All Products', 
            path:'/'
            
        });
        
    })
    .catch(err=>console.log(err));

};
exports.getProduct = (req, res, next) => {
    const prodId = req.params.productId;
    // Product.findAll({ where: { id: prodId } })
    //   .then(products => {
    //     res.render('shop/product-detail', {
    //       product: products[0],
    //       pageTitle: products[0].title,
    //       path: '/products'
    //     });
    //   })
    //   .catch(err => console.log(err));
    Product.findByPk(prodId)
      .then(products => {
        res.render('shop/product-detail', {
          product: products,
          pageTitle: products.title,
          path: '/products'
        });
      })
      .catch(err => console.log(err));
  };

exports.getIndex = (req, res, next) => {
    Product.findAll()
        .then(products => {
            res.render('shop/index', {
            prods: products,
            pageTitle: 'Shop', 
            path:'/'
        });
    })
    .catch(err => console.log(err) );
        

};

exports.getCart = (req, res, next) => {
    req.user.getCart()
    .then(cart=>{
        return cart.getProducts()
        .then(products=>{
            res.render('shop/cart',{ 
                path: '/cart',
                pageTitle: 'YourCart',
                products: products
                
            });
        })
        .catch(err=>console.log(err));
    })
    .catch(err=>console.log(err));
    // Cart.getCart(cart => {
    //     let cartTotal = parseInt(cart.totalPrice);
        
    //     Product.fetchAll(products =>{
    //         const cartProducts = [];
            
    //         for(product of products){
    //             const cartProdData = cart.products.find(prod => prod.id === product.id);
    //             if(cartProdData){
    //                 cartProducts.push({productData: product, qty: cartProdData.qty});
    //             }
    //         }
    //         res.render('shop/cart',{ 
    //             path:'/cart',
    //             pageTitle: 'YourCart',
    //             products: cartProducts,
    //             cartTotal: cartTotal
    //         });  
    //     });
    // });
     

};

exports.postCart= (req,res,next) =>{
    const prodId = req.body.productId;
    let prodPrice = req.body.price;
    let fetchedCart;
    let newQuant = 1 ;
    console.log(" ---> ide del producto <---  "+ prodId)
    req.user.getCart()
    .then(cart=>{
        fetchedCart = cart;
        return cart.getProducts({ where: {id: prodId}});
    })
    .then(products=>{
        
        if(products[0]){
            const oldQuant = products[0].cartItem.cantidad;
            newQuant = oldQuant+1;
            prodPrice = prodPrice*newQuant;
            console.log(" ---> ide del producto <---  "+ prodId)
            return Promise.resolve(products);
        }
        return Product.findByPk(prodId)
            

    })
    .then(products=>{
        return fetchedCart.addProduct(products[0],{ through: { cantidad: newQuant, prodTotal: prodPrice}});
    })
    .then(() =>{
        res.redirect('/cart');
    })
    .catch(err=>console.log(err));

    Product.findByPk(prodId,(product) =>{
        Cart.addProduct(prodId, product.price,product.title);
    })
    
};

exports.postCartDelete = (req,res,next) => {
    const prodId = req.body.productId;
  
    Product.findByPk(prodId,product =>{
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
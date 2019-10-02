const Product = require('../model/product');

exports.getAddProduct = (req, res, next) => {
    // res.sendFile(path.join(rootDir,'views','add-product.html'));
    res.render('admin/add-product',
    {pageTitle: 'Add Product', 
    path: '/admin/add-product'
    });
};

exports.postAddProduct =  (req, res, next) => {
    const title = req.body.title;
    const imgUrl = req.body.imgUrl;
    const price = req.body.price;
    const description = req.body.description;
    const product = new Product(title,imgUrl,price,description);
    product.save();
    res.redirect('/');
};


exports.getProducts = (req, res, next) => {
    Product.fetchAll(products=>{
          res.render('admin/products',{
              prods: products,
              pageTitle: 'Admin Products', 
              path:'/admin/products'
          });
      
      });    
  
  };
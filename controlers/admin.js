const Product = require('../model/product');

exports.getAddProduct = (req, res, next) => {
    // res.sendFile(path.join(rootDir,'views','add-product.html'));
    res.render('admin/add-product',
    {pageTitle: 'Add Product', 
    path: '/admin/add-product',
    editing: false
    });
};

exports.postAddProduct =  (req, res, next) => {
    
    const title = req.body.title;
    const imgUrl = req.body.imgUrl;
    const price = req.body.price;
    const description = req.body.description;
    const id = null;
    const product = new Product(id,title,imgUrl,price,description);
    product.save()
        .then(()=>{
            res.redirect('/');
        })
        .catch(err=>{console.log(err)});;
    
};

exports.getEditProduct = (req, res, next) => {
    // res.sendFile(path.join(rootDir,'views','add-product.html'));
    const editMode = req.query.edit;
    if(!editMode){
        return res.redirect('/');

    }
    const prodId = req.params.productId;
    Product.findById(prodId, product => {
        if(!product){
            res.redirect('/');
        } 
        res.render('admin/edit-product', {
            pageTitle: 'Add Product', 
            path: '/admin/edit-product',
            editing : editMode,
            product : product
        
        });
    });
   
};
exports.postEditProduct = (req,res,next)=>{
    const prodId = req.body.productId;
    const updatedTitle = req.body.title;
    const updatedPrice = req.body.price;
    const updatedImgUrl = req.body.imgUrl;
    const updatedDescription = req.body.description;
    const updatedProduct = new Product(prodId,updatedTitle,updatedImgUrl,updatedPrice,updatedDescription);
    updatedProduct.save()
        .then(()=>{
            res.redirect('/admin/products');
        })
        .catch(err=>{console.log(err)});
    
}


exports.getProducts = (req, res, next) => {
    Product.fetchAll(products=>{
          res.render('admin/products',{
              prods: products,
              pageTitle: 'Admin Products', 
              path:'/admin/products'
          });
      
      });    
  
  };

exports.postDeleteProduct = (req,res,next)=>{
    const prodId = req.body.productId;
    Product.deleteById(prodId); //agregar callbacks!
    res.redirect('/admin/products');


}
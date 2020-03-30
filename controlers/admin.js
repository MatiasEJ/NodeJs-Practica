const Product = require('../model/product');
const { validationResult } = require('express-validator');


exports.getAddProduct = (req, res, next) => {
    res.render('admin/add-product',{
        pageTitle: 'Add Product', 
        path: '/admin/add-product',
        editing: false,
        errorMessage: null, 
        validationErrors: []
    });
};

exports.postAddProduct =  (req, res, next) => {
    const title = req.body.title;
    const imageUrl = req.body.imageUrl;
    const price = req.body.price;
    const description = req.body.description;
    
    const errors = validationResult(req);

    if (!errors.isEmpty()) {

    return res
    .status(422)
    .render('admin/edit-product', {
        path: '/admin/edit-product',
        pageTitle: 'Add Product',
        editing: false, 
        errorMessage: errors.array()[0].msg,
        validationErrors: errors.array(),
        product:{
            title:title,
            price:price,
            description:description,
            imageUrl:imageUrl
        }

    });
    }

    const product = new Product({
        title:title,
        price:price,
        description:description,
        imageUrl:imageUrl, 
        userId: req.user
      });

    product
      .save()
      .then(result =>{
          console.log("Producto creado!!", result.title);
          res.redirect('/admin/products');
      })
      .catch( (err) => {
        const error = new Error(err);
        error.httpStatusCode = 500;
        return next(error);
        }
      );
    
};

exports.getProducts = (req, res, next) => {

    Product.find({ userId: req.user._id })
    //ver solo productos de usuario { userId: req.user._id }
    //seleccionar info
    //.select('title price - _id')
    //obtener info del usuario
    // .populate('userId', 'name')
    .then(products=>{
        res.render('admin/products',{
            prods: products,
            pageTitle: 'Admin Products', 
            path:'/admin/products',
            
        })  
    })
    .catch( (err) => {
        const error = new Error(err);
        error.httpStatusCode = 500;
        return next(error);
        }
      );    
};


exports.getEditProduct = (req, res, next) => {
    // res.sendFile(path.join(rootDir,'views','add-product.html'));
    const editMode = req.query.edit;
    if(!editMode){
        return res.redirect('/');
    }
    const prodId = req.params.productId;
    Product.findById(prodId)
    .then(product => {
        if(!product){
            //no product
            res.redirect('/');
        } 
        res.render('admin/edit-product', {
            pageTitle: 'Edit Product', 
            path: '/admin/edit-product',
            editing : editMode,
            product : product,
             
        
        })
    })
    .catch( (err) => {
        const error = new Error(err);
        error.httpStatusCode = 500;
        return next(error);
        }
      );
   
};

exports.postEditProduct = (req,res,next)=>{
    const prodId = req.body.productId;
    const updatedTitle = req.body.title;
    const updatedPrice = req.body.price;
    const updatedImgUrl = req.body.imgUrl;
    const updatedDescription = req.body.description;

    Product.findById(prodId)
    .then(product=>{
        //User Protection
        if(product.userId !== req.user._id){
            return res.redirect('/');
        }
        product.title = updatedTitle;
        product.price = updatedPrice;
        product.description = updatedDescription;
        product.imageUrl = updatedImgUrl;
        return product
            .save()
            .then(result =>{
                console.log("Editado Correcto");
                res.redirect('/admin/products');
            })
            .catch(e=>console.log("Error salvado edit:",e));
    })
    .catch( (err) => {
        const error = new Error(err);
        error.httpStatusCode = 500;
        return next(error);
        }
      );
   

}

exports.postDeleteProduct = (req,res,next)=>{
    const prodId = req.body.productId;
    Product
    .deleteOne({_id: prodId, userId: req.user._id})
    .then(()=>{
        console.log("producto borrado")
        res.redirect('/admin/products');
    }).catch( (err) => {
        const error = new Error(err);
        error.httpStatusCode = 500;
        return next(error);
        }
      ); //agregar callbacks!
    


}
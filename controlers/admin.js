// const Product = require('../model/product');
// const user = require('../model/user');
// const mongodb = require('mongodb');
// const getDb = require('../util/mongodb').getDb;

// const ObjectId = mongodb.ObjectID;


// exports.postAddProduct =  (req, res, next) => {
//     const title = req.body.title;
//     const imgUrl = req.body.imgUrl;
//     const price = req.body.price;
//     const description = req.body.description;
    
//     const product = new Product(
//         title,
//         imgUrl,
//         price,
//         description,
//         null,
//         req.user._id
//     );
//     product
//     .save()
//     .then(result =>{
//         console.log("Producto creado!!");
//         res.redirect('/');
//     })
//     .catch(err=>console.log(err));
    
// };
// exports.getProducts = (req, res, next) => {
//     Product.fetchAll().then(products=>{
//         res.render('admin/products',{
//             prods: products,
//             pageTitle: 'Admin Products', 
//             path:'/admin/products'
//         })
      
//       }).catch((e)=>console.log("Erro en obtener prods: ",e))    
  
//   };


// exports.getAddProduct = (req, res, next) => {
   
//     res.render('admin/add-product',
//     {pageTitle: 'Add Product', 
//     path: '/admin/add-product',
//     editing: false
//     });
// };

// exports.getEditProduct = (req, res, next) => {
//     // res.sendFile(path.join(rootDir,'views','add-product.html'));
//     const editMode = req.query.edit;
//     if(!editMode){
//         return res.redirect('/');

//     }
//     const prodId = req.params.productId;
//     Product.findById(prodId).then(product => {
//         if(!product){
//             res.redirect('/');
//         } 
//         res.render('admin/edit-product', {
//             pageTitle: 'Edit Product', 
//             path: '/admin/edit-product',
//             editing : editMode,
//             product : product
        
//         })
//     });
   
// };

// exports.postEditProduct = (req,res,next)=>{
//     const prodId = req.body.productId;
//     const updatedTitle = req.body.title;
//     const updatedPrice = req.body.price;
//     const updatedImgUrl = req.body.imgUrl;
//     const updatedDescription = req.body.description;
//     const product = new Product(updatedTitle,updatedImgUrl, updatedPrice, updatedDescription, prodId);
//     product.save()
//     .then(result =>{
//         console.log("Editado Correcto");
//         res.redirect('/admin/products');
//     })
//     .catch(e=>console.log("Error editando: ",e));

// }




// exports.postDeleteProduct = (req,res,next)=>{
//     const prodId = req.body.productId;
//     Product.deleteById(prodId)
//     .then(result=>{
//         res.redirect('/admin/products');
//     }).catch(e=>console.log("borrado de",e)); //agregar callbacks!
    


// }
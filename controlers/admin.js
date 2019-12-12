const Product = require('../model/product');
const user = require('../model/user')


exports.getAddProduct = (req, res, next) => {
    // res.sendFile(path.join(rootDir,'views','add-product.html'));
    res.render('admin/add-product', {
        pageTitle: 'Add Product',
        path: '/admin/add-product',
        editing: false
    });
};

exports.postAddProduct = (req, res, next) => {
    
    const title = req.body.title;
    const imgUrl = req.body.imgUrl;
    const price = req.body.price;
    const description = req.body.description;
    
    Product.create({
        title: title,
        price: price,
        imgUrl: imgUrl,
        description: description,
        userId: req.user.id
        
    })
    .then(() =>{ 
        console.log("Objeto Creado" + req.body.title);
        res.redirect('/admin/products');
    })
    .catch(err=>console.log(err));
    
};

exports.getEditProduct = (req, res, next) => {
    // res.sendFile(path.join(rootDir,'views','add-product.html'));
    const editMode = req.query.edit;
    if (!editMode) {
        return res.redirect('/');

    }
    const prodId = req.params.productId;
    req.user.getProducts({where: {id: prodId}})
    // Product.findAll({where: {id: prodId}})
    Product.findByPk(prodId)
    .then(product=>{
        // const product = products[0];
        if (!product) {
            res.redirect('/');
        }
            res.render('admin/edit-product', {
            pageTitle: 'Add Product',
            path: '/admin/edit-product',
            editing: editMode,
            product: product

        });
    })
    .catch(err=>console.log(err));
    // Product.findByPk(prodId, product => {
    //     if (!product) {
    //         res.redirect('/');
    //     }
    //     res.render('admin/edit-product', {
    //         pageTitle: 'Add Product',
    //         path: '/admin/edit-product',
    //         editing: editMode,
    //         product: product

    //     });
    // });

};
exports.postEditProduct = (req, res, next) => {
    const prodId = req.body.productId;
    const updatedTitle = req.body.title;
    const updatedPrice = req.body.price;
    const updatedImgUrl = req.body.imgUrl;
    const updatedDescription = req.body.description;
    Product.findByPk(prodId)
        .then(product=>{
            product.title = updatedTitle;
            product.price = updatedPrice;
            product.imgUrl = updatedImgUrl;
            product.description = updatedDescription;
            return product.save();
        }).then(() => {
            console.log("actualizado");
            res.redirect('/admin/products');
        })
        .catch(err=>console.log(err));

}


exports.getProducts = (req, res, next) => {
    Product.findAll()
        .then(products => {
            res.render('admin/products', {
                prods: products,
                pageTitle: 'Admin Products',
                path: '/admin/products'
            });
        })
        .catch(err => console.log(err));
    // Product.fetchAll(products=>{
    //       res.render('admin/products',{
    //           prods: products,
    //           pageTitle: 'Admin Products', 
    //           path:'/admin/products'
    //       });

    //   });    

};

exports.postDeleteProduct = (req, res, next) => {
    const prodId = req.body.productId;
    console.log("A eliminar "+ prodId);
    Product.findByPk(prodId)
    .then(product =>{
        return product.destroy();
    })
    .then(()=>{
        console.log("DESTRUIDO: ");
        res.redirect('/admin/products');
    }).catch(err=>console.log("Error en: "+err))
    
    


}
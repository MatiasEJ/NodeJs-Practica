const path = require('path');

const express= require('express');

const adminController = require('../controlers/admin');
const isAuth = require('../midleware/isAuth');
const router = express.Router();


// //admin GET
router.get('/add-product', isAuth,adminController.getAddProduct);
router.get('/products',isAuth,adminController.getProducts);


// //admin POST
router.post('/add-product',isAuth, adminController.postAddProduct);

router.get('/edit-product/:productId',isAuth,adminController.getEditProduct);
router.post('/edit-product',isAuth,adminController.postEditProduct);

router.post('/edit-product',isAuth,adminController.postDeleteProduct);



module.exports = router;

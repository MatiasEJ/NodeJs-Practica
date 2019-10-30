const path = require('path');

const express= require('express');

const adminController = require('../controlers/admin');

const router = express.Router();

const products = [];




//admin GET
router.get('/edit-product', adminController.getAddProduct);
router.get('/products',adminController.getProducts);


//admin POST
router.post('/edit-product', adminController.postAddProduct);

router.get('/edit-product/:productId',adminController.getEditProduct);




module.exports = router;
exports.products = products;
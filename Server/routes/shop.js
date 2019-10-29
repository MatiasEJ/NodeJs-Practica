const path = require('path');
const express= require('express');

const shopControllers = require('../controlers/shop');

const router = express.Router();

router.get('/', shopControllers.getIndex);
router.get('/products',shopControllers.getProducts);

router.get('/products/:productId',shopControllers.getProduct);


router.get('/cart',shopControllers.getCart);

router.post('/cart',shopControllers.postCart)


router.get('/checkout',shopControllers.getcheckout);
router.get('/orders',shopControllers.getOrders);


module.exports = router;
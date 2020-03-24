
const express= require('express');
const authControler = require('../controlers/auth')

const router = express.Router();

//GET
router.get('/login', authControler.getLogin);
router.get('/signup', authControler.getSignup);


//POST
router.post('/login', authControler.postLogin);
router.post('/logout', authControler.postLogout);
router.post('/signup', authControler.postSignup);


module.exports = router;
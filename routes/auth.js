
const express= require('express');
const authControler = require('../controlers/auth')

const router = express.Router();

//GET
router.get('/login', authControler.getLogin);

//POST
router.post('/login', authControler.postLogin);
router.post('/logout', authControler.postLogout);



module.exports = router;

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

router.get('/reset', authControler.getReset);
router.post('/reset', authControler.postReset);

router.get('/reset/:token', authControler.getNewPass);
router.post('/new-pass', authControler.postNewPass);




module.exports = router;
const express = require('express');
const {
  check,
  body
} = require('express-validator');
const authControler = require('../controlers/auth')
const User = require('../model/user');

const router = express.Router();

//GET
router.get('/login', authControler.getLogin);
router.get('/signup', authControler.getSignup);


//POST
router.post('/login', authControler.postLogin);
router.post('/logout', authControler.postLogout);
router.post('/signup',
  [
    check('email')
    .isEmail()
    .withMessage('Please enter valid E-mail')
    .custom((value, { req }) => {
      // if (value === 'test@test.com') {
      //   throw new Error('Este email esta prohibido ')
      // }
      User.findOne({email: value})
      .then(userDoc => {
        if(userDoc){
          return Promise.reject('Email ya existe');
      }});
    }),
    body('password', 'password with 5 chars, alfa num')
    .isLength({
      min: 5
    })
    .isAlphanumeric(),
    body('confirmPassword').custom((value, {req})=>{
      if(value !== req.body.password){
          throw new Error('Password is not the same')

      }
      return true;
    })
  
  ],
  authControler.postSignup);

router.get('/reset', authControler.getReset);
router.post('/reset', authControler.postReset);

router.get('/reset/:token', authControler.getNewPass);
router.post('/new-pass', authControler.postNewPass);




module.exports = router;
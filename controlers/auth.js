const bcrypt = require('bcrypt');
const User = require('../model/user');


exports.getLogin = (req, res, next) => {
  // const isLoggedIn = req.get('Cookie').split('=')[1]; 
  // console.log("Esta logeado?: ", isLoggedIn);
  // const isLoggedIn = req.session.isLoggedIn;
  res.render('auth/login', {
    path: '/login',
    pageTitle: 'LogIn',
    isAuth: false
  });


};

exports.postLogin = (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;
  User.findOne({email:email})
  .then(user=>{
    if(!user){
      console.warn("No hay Usuario")
      return res.redirect('/login');
    }else{
      bcrypt.compare(password, user.password)
      .then(doMatch=>{
        if (doMatch){
          
          req.session.isLoggedIn = true;
          req.session.user = user;
          return req.session.save((err) => {
            if (err){console.log(err);}   
            console.warn("USUARIO ACEPTADO")
            res.redirect('/');
          });
        } 
        console.warn("WRONG PASSWORD")
        res.redirect('/login');
      })
      .catch(e=>{
        console.log(e)
        res.redirect('/login');
      })
    }
  })
 
  .catch(err => console.log('error en postLogin', err));
};

exports.postLogout = (req, res, next) => {
  
  req.session.destroy((err) => {
    if (err){console.log(err);}
    res.redirect('/');
  });

};

exports.getSignup = (req, res, next) => {
  
  res.render('auth/signup', {
    path: '/signup',
    pageTitle: 'signup',
    isAuth: false
  });

};

exports.postSignup = (req, res, next) => {
  
  const email = req.body.email;
  const password = req.body.password;
  const confirmPassword = req.body.confirmPassword;
  User.findOne({email: email}).then(userDoc => {
    if(userDoc){
      return res.redirect('/signup');
    }else{
      return bcrypt.hash(password, 12).then(hashPassword => {
    
        const user = new User({
          email: email,
          password: hashPassword,
          cart: {items: []}
        });
        return user.save();
      })
      .then(result => {
        res.redirect('/login');
      }).catch(e=>console.log(e));      
    }
  })
  .catch(e=>console.log(e))




};
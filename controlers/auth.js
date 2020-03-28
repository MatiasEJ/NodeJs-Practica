const bcrypt = require('bcrypt');
const error = require('./error')
const nodemailer = require('nodemailer');
const sgTransport = require('nodemailer-sendgrid-transport');


const User = require('../model/user');

let options = {
  auth: {
    api_key: process.env.DIR_MAIL
  }
}



const transporter = nodemailer.createTransport(sgTransport(options));

exports.getLogin = (req, res, next) => {
  let message = error.errorPop(req);
  res.render('auth/login', {
    path: '/login',
    pageTitle: 'LogIn',
    errorMessage: message
  });


};

exports.postLogin = (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;
  User.findOne({email:email})
  .then(user=>{
    if(!user){
      console.warn("No hay Usuario")
      req.flash('error', 'No existe el usuario');
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
        req.flash('error', 'wrongo passwordo');
        return res.redirect('/login');
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
  let message = error.errorPop(req);
  res.render('auth/signup', {
    path: '/signup',
    pageTitle: 'signup',
    isAuth: false,
    errorMessage: message
  });

};

exports.postSignup = (req, res, next) => {
  
  const email = req.body.email;
  const password = req.body.password;
  const confirmPassword = req.body.confirmPassword;

  let mailSignup = {
    to: email,
    from: 'test@example.com',
    subject: 'Sending with Twilio SendGrid is Fun',
    text: 'and easy to do anywhere, even with Node.js',
    html: '<strong>and easy to do anywhere, even with Node.js</strong>',
  } 

  User.findOne({email: email}).then(userDoc => {
    if(userDoc){
      req.flash('error', 'Error en mail');
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
        // TODO: AVISO DE ENVIO CORRECTO req.flash('error', 'Error en mail');
        res.redirect('/login');

        
        /**ENVIO DE MAIL **/
        return transporter.sendMail(mailSignup)
        .catch(e=>console.log('error en mail: ',e))
        

      }).catch(e=>console.log(e));      
    }
  })
  .catch(e=>console.log(e))


 

};
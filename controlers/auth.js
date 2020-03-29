const crypto = require('crypto');
const bcrypt = require('bcrypt');
// const error = require('./error');
const nodemailer = require('nodemailer');
const sgTransport = require('nodemailer-sendgrid-transport');
const {
  validationResult
} = require('express-validator');


const User = require('../model/user');

let options = {
  auth: {
    api_key: process.env.DIR_MAIL
  }
}
const transporter = nodemailer.createTransport(sgTransport(options));


/**
 * 
 * LOGIN */

exports.getLogin = (req, res, next) => {
  let message = req.flash('error', 'Error en Login');
  if (message.length > 0) {
    message = message[0];
  } else {
    message = null;
  }
  res.render('auth/login', {
    path: '/login',
    pageTitle: 'LogIn',
    errorMessage: message, 
    oldInput: {
      emai: "",password: "", confirmPassword: ""
    },
    validationErrors: []
  });
};

exports.postLogin = (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
  
    return res.status(422).render('auth/login', {
      path: '/login',
      pageTitle: 'login',
      errorMessage: errors.array()[0].msg, 
      oldInput: {
        emai: "",password: "", confirmPassword: ""
      },
      validationErrors: []
    });
  }

  User
    .findOne({email: email})
    .then(user => {
      if (!user) {
        return res.status(422).render('auth/login', {
          path: '/login',
          pageTitle: 'login',
          errorMessage: "Invalid mail or password", 
          oldInput: {
            emai: "",password: "", confirmPassword: ""
          },
          validationErrors: []
        });
      } else {
        bcrypt.compare(password, user.password)
          .then(doMatch => {
            if (doMatch) {

              req.session.isLoggedIn = true;
              req.session.user = user;
              return req.session.save((err) => {
                if (err) {
                  console.log(err);
                }
                console.warn("USUARIO ACEPTADO")
                res.redirect('/');
              });
            }
            //WRONG PASS
            return res.status(422).render('auth/login', {
              path: '/login',
              pageTitle: 'login',
              errorMessage: "Invalid password", 
              oldInput: {
                emai: "",password: "", confirmPassword: ""
              },
              validationErrors: []
            });
          })
          .catch(e => {
            console.log(e)
            res.redirect('/login');
          })
      }
    })

    .catch(err => console.log('error en postLogin', err));
};

exports.postLogout = (req, res, next) => {

  req.session.destroy((err) => {
    if (err) {
      console.log(err);
    }
    res.redirect('/');
  });

};


/**
 **LOGOUT
 **/
exports.getSignup = (req, res, next) => {
  let message = req.flash('error', 'Error en newPass');
  if (message.length > 0) {
    message = message[0];
  } else {
    message = null;
  }

  const errors = validationResult(req);

  res.render('auth/signup', {
    path: '/signup',
    pageTitle: 'signup',
    errorMessage: message, 
    oldInput: {
      emai: "",password: "", confirmPassword: ""
    },
    validationErrors: []
  });

};

exports.postSignup = (req, res, next) => {

const email = req.body.email;
const password = req.body.password;

const errors = validationResult(req);

if (!errors.isEmpty()) {

  return res
  .status(422)
  .render('auth/signup', {
    path: '/signup',
    pageTitle: 'signup',
    errorMessage: errors.array()[0].msg,
    oldInput: { email: email, password: password, confirmPassword: req.body.confirmPassword},
    validationErrors: errors.array()
  });
}

let mailSignup = {
  to: email,
  from: process.env.DIR_MYMAIL,
  subject: 'SIGNUP correctin',
  text: 'Todo buenardo amigardo',
  html: '<strong>and easy to do anywhere, even with Node.js</strong>',
}

bcrypt
  .hash(password, 12)
  .then(hashPassword => {
    const user = new User({
      email: email,
      password: hashPassword,
      cart: {
        items: []
      }
    });
    return user.save();
  })
  .then(result => {
    // TODO: AVISO DE ENVIO CORRECTO req.flash('error', 'Error en mail');
    res.redirect('/login');
    /**ENVIO DE MAIL **/
    return transporter
      .sendMail(mailSignup)
      .catch(e => console.log('error en mail: ', e))
  })
  .catch(e => console.log(e));

};


/**
 * RESET */
exports.getReset = (req, res, next) => {
  let message = req.flash('error', 'Error en newPass');
  if (message.length > 0) {
    message = message[0];
  } else {
    message = null;
  }
  res.render('auth/reset', {
    path: '/reset',
    pageTitle: 'Reset Password',
    errorMessage: message
  });
};

exports.postReset = (req, res, next) => {
  const email = req.body.email;
  crypto.randomBytes(32, (err, buffer) => {
    if (err) {
      console.log(err)
      return res.redirect('/reset')
    }
    const token = buffer.toString('hex');
    let mailReset = {
      to: email,
      from: process.env.DIR_MYMAIL,
      subject: 'RESETEO DE PASSWORD correctin',
      text: 'Todo buenardo amigardo',
      html: `
        <strong>Testeando multilinea</strong>
        <h1>QUE ONDASSS</h1>
        <a href="http://localhost:3000/reset/${token}"> LINK DE RESETEO </a>
        `,
    };
    User.findOne({
        email: email
      })
      .then(user => {
        if (!user) {
          req.flash('error', 'Usuario no encontrado');

          return res.redirect('/signup');
        }
        user.resetToken = token;
        user.resetTokenExpiration = Date.now() + 3600000;
        return user.save();

      })
      .then(result => {
        res.redirect('/login');
        return transporter
          .sendMail(mailReset)
          .catch(e => console.log('error en mail de reset ', e))
      })
      .catch(e => console.log(e))

  });


}

exports.getNewPass = (req, res, next) => {
  const token = req.params.token;
  User.findOne({
      resetToken: token,
      resetTokenExpiration: {
        $gt: Date.now()
      }
    })
    .then(user => {

      let message = req.flash('error', 'Error en newPass');
      if (message.length > 0) {
        message = message[0];
      } else {
        message = null;
      }
      res.render('auth/new-pass', {
        path: '/new-pass',
        pageTitle: 'New Pass',
        errorMessage: message,
        userId: user._id.toString(),
        passToken: token
      });


    })
    .catch(e => console.log(e));



}

exports.postNewPass = (req, res, next) => {
  const newPass = req.body.password;
  const userId = req.body.userId;
  const passToken = req.body.passToken;

  let resetUser;

  User.findOne({
      resetToken: passToken,
      resetTokenExpiration: {
        $gt: Date.now()
      },
      _id: userId
    })
    .then(user => {
      resetUser = user;
      return bcrypt.hash(newPass, 12);
    })
    .then(hashedPass => {
      resetUser.password = hashedPass;
      resetUser.resetToken = undefined;
      resetUser.resetTokenExpiration = undefined;
      return resetUser.save()
    })
    .then(result => {
      //confirmar reseteo.
      res.redirect('/login')
    })
    .catch(e => console.log(e))


}
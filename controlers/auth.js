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


/* LOGIN */
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
      emai: "",
      password: "",
    },
    validationErrors: []
  });
};

exports.postLogin = (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    console.log(errors.array()[0].msg)
    return res.status(422).render('auth/login', {
      path: '/login',
      pageTitle: 'login',
      errorMessage: errors.array()[0].msg, 
      oldInput: {
        emai: email,
        password: password
      },
      validationErrors: errors.array()
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
            emai: email,
            password: password,
            
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
                emai: email,
                password: password,
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

    .catch( (err) => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
      }
    );
};

/* LOGOUT */
exports.postLogout = (req, res, next) => {

  req.session.destroy((err) => {
    if (err) {
      console.log(err);
    }
    res.redirect('/');
  });

};

/* SIGNUP */
exports.getSignup = (req, res, next) => {
  let message = req.flash('error', 'Error en newPass');
  if (message.length > 0) {
    message = message[0];
  } else {
    message = null;
  }

  // const errors = validationResult(req);

  // if (!errors.isEmpty()) {
  //   return res.status(422).render('auth/login', {
  //     path: '/login',
  //     pageTitle: 'login',
  //     errorMessage: errors.array()[0].msg, 
  //     oldInput: {
  //       emai: "",
  //       password: "", 
  //       confirmPassword: ""
  //     },
  //     validationErrors: []
  //   });
  // }

  res.render('auth/signup', {
    path: '/signup',
    pageTitle: 'signup',
    errorMessage: message, 
    oldInput: {
      emai: "",
      password: "", 
      confirmPassword: ""
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
      oldInput: { 
        email: email,
        password: password,
        confirmPassword: req.body.confirmPassword
      },
      validationErrors: errors.array()
    });
}

let mailSignup = {
  to: email,
  from: process.env.DIR_MYMAIL,
  subject: 'Confirmacion de subscripcion a MercaditApp',
  html: `
    <h1>Subscripción realizada con éxito.</h1>
    <strong>En breve estaremos ampliando nuestras funcionalidades.<strong>
  `,
}

bcrypt
  .hash(password, 12)
  .then(hashPassword => {
    const user = new User({
      email: email,
      password: hashPassword,
      cart: { items: [] }
    });
    return user.save();
  })
  .then(result => {
    // TODO: AVISO DE ENVIO CORRECTO req.flash('error', 'Error en mail');
    res.redirect('/login');
    /**ENVIO DE MAIL **/
    return transporter
      .sendMail(mailSignup)
      .catch( (err) => {
        const error = new Error(err);
        error.httpStatusCode = 500;
        return next(error);
        }
      )
  })
  .catch( (err) => {
    const error = new Error(err);
    error.httpStatusCode = 500;
    return next(error);
    }
  );

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
      subject: 'Confirmación de RESET de Password de MercaditApp',
      html: `
        <h1>Click en el Link para confirmar el reset de password.</h1>
        <a href="https://mercaditapp.herokuapp.com/reset/${token}"> LINK DE RESETEO </a>
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
          .catch( (err) => {
            const error = new Error(err);
            error.httpStatusCode = 500;
            return next(error);
            }
          )
      })
      .catch( (err) => {
        const error = new Error(err);
        error.httpStatusCode = 500;
        return next(error);
        }
      )

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
    .catch( (err) => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
      }
    );



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
    .catch( (err) => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
      }
    )


}
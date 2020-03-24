const User = require('../model/user');

exports.getLogin = (req, res, next) => {
  // const isLoggedIn = req.get('Cookie').split('=')[1]; 
  // console.log("Esta logeado?: ", isLoggedIn);
  // const isLoggedIn = req.session.isLoggedIn;
  res.render('auth/login',{ 
          path:'/login',
          pageTitle: 'LogIn',
          isAuth: false
      });    

  
};

exports.postLogin = (req, res, next) => {
  User.findById('5e778682a4517c2714d87323')
  .then(user=>{
    req.session.isLoggedIn = true;
    req.session.user = user;
    req.session.save( (err)=>{
      console.log(err);
      res.redirect('/');
    });
  })
  .catch(err=>console.log('error en postLogin', err)); 
};

exports.postLogout = (req, res, next) => {
  console.log("LOGGINOUT")
  req.session.destroy((err)=>{
    console.log("error en outlog", err)
    res.redirect('/');
  });
  
};



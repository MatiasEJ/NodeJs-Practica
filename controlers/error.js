exports.errorHand = (req,res,next)=>{
    res.status(404).render('404',{pageTitle:'Page Not Found',path: '/404',
     
    });
};

exports.get500 = (req,res,next)=>{
    res
      .status(500)
      .render('500',{
        pageTitle:'Error 500',
        path: '/500',
        isAuth: req.session.inLoggedIn
        });
};

// exports.errorPop = (req, res, next) => {
//     let message = req.flash('error');
//     if (message.length > 0 ){
//        return message = message[0];
//     }else{
//      return message = null;
//     }
// }
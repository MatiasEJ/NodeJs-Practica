exports.errorHand = (req,res,next)=>{
    res.status(404).render('404',{pageTitle:'Page Not Found',path: '/404',
    isAuth: req.session.isLoggedIn
    });
};
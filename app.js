// const http = require('http'); //creacion server
// const route = require('./routes');
// console.log(route.someText);
//Usamos templates, js, ejs/jade/handlebars

require('dotenv').config()
const path = require('path');
const express = require('express');
const session = require('express-session')
const errorController = require('./controlers/error');
const app = express();
const bodyParser = require('body-parser');
const MongoDBStore = require('connect-mongodb-session')(session)
const csrf = require('csurf');
const flash = require('connect-flash');

const store = new MongoDBStore({
    uri: process.env.DIR_MONGO, 
    collection: 'sessions'
})
const csrfProtection = csrf();

app.use(flash());

app.use(bodyParser.urlencoded({
    extended: false
}));
app.use(express.static(path.join(__dirname, 'public')));

/* SERVER */

const port = process.env.PORT || 3000;
const User = require('./model/user')
const mongoose = require('mongoose');

/* VIEWS */
app.set('view engine', 'ejs');
app.set('views', 'views');

const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');
const authRoutes = require('./routes/auth');


/* APP REQUEST */
app.use(session({ 
    secret: 'mysecret',
    resave: false,
    saveUninitialized: false, 
    store: store
}))

//PROTECTION CSRF
app.use(csrfProtection);
app.use( (req, res, next)=>{
    res.locals.isAuth = req.session.isLoggedIn;
    res.locals.csrfToken = req.csrfToken();
    next();
})

app.use( (req, res, next)=>{
    if(!req.session.user){
       return next();
    }
    User.findById(req.session.user._id)
        .then(user=>{
            if(!user){
                return next();
            }
            req.user = user; //mongoose model.    
            next();
        })
        .catch(err=>{
            next(new Error(err));
        }); 
})



/* ROUTES */
app.use('/admin', adminRoutes);
app.use(shopRoutes);
app.use(authRoutes);

/* ERROR HANDLING */
app.use(errorController.errorHand);
app.use(errorController.get500);
app.use( (error, req, res, next) => {
    res
    .status(500)
    .render('500',{
      pageTitle:'Error 500',
      path: '/500',
      isAuth: req.session.inLoggedIn
      });
});

/* SERVER CONNECTION */
mongoose
    .connect(process.env.DIR_MONGO, 
        {
        useNewUrlParser: true,
        useUnifiedTopology: true
        }
    )
    .then(result => {
        
        console.log(`Conectado a puerto: ${port}`)
        app.listen(port);

    })
    .catch(err => console.log("Error en conexion: ", err))
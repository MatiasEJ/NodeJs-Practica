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
// const csrf = require('csurf');



const store = new MongoDBStore({
    uri: process.env.DIR_MONGO, 
    collection: 'sessions'
})

// const csrfProtection = csrf();


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

/* ROUTES */
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

// //PROTECTION
// app.use(csrfProtection);

app.use( (req, res, next)=>{
    if(!req.session.user){
       return next();
    }
    User.findById(req.session.user._id)
    .then(user=>{
        req.user = user; //mongoose model.    
        next();
    })
    .catch(err=>console.log('error en user session', err)); 
})

app.use( (req, res, next)=>{
    res.locals.isAuth = req.session.isLoggedIn;
    // res.locals.csrfToken = req.csrfToken();
    next();

})

app.use('/admin', adminRoutes);
app.use(shopRoutes);
app.use(authRoutes);

/* ERROR HANDLING */
app.use(errorController.errorHand);


/* SERVER CONNECTION */
mongoose
    .connect(process.env.DIR_MONGO, 
        {
        useNewUrlParser: true,
        useUnifiedTopology: true
        }
    )
    .then(result => {
        console.clear();
        
        console.log(`Conectado a puerto: ${port}`)

        app.listen(port);

    })
    .catch(err => console.log("Error en conexion: ", err))
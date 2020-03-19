// const http = require('http'); //creacion server
// const route = require('./routes');
// console.log(route.someText);
//Usamos templates, js, ejs/jade/handlebars

require('dotenv').config()
const path = require('path');
const express = require('express');
const errorController = require('./controlers/error');
const app = express(); 
const bodyParser= require('body-parser');
app.use(bodyParser.urlencoded({extended:false}));
app.use(express.static(path.join(__dirname,'public')));

/* SERVER */ 
const mongoConnect = require('./util/mongodb').mongoConnect;
const port = process.env.PORT || 3000;
const User = require('./model/user')
/* VIEWS */ 
app.set('view engine','ejs');
app.set('views','views');

/* ROUTES */
const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');


/* APP REQUEST */
app.use((req,res,next) =>{
    User.findById('5e5e94b21c9d440000d19601')
    .then(user=>{
        req.user = new User(user.name, user.email,user.cart, user._id);
        
        next();
    })
    .catch((e)=>console.log("error en request usuario",e));
    
})


app.use('/admin',adminRoutes);
app.use(shopRoutes);

/* ERROR HANDLING */ 
app.use(errorController.errorHand);


/* SERVER CONNECTION */
mongoConnect( client =>{
    console.clear();
    app.listen(port);
    console.log(`conectado a ${port}`);
});
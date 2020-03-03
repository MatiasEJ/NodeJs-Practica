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

/* VIEWS */ 
app.set('view engine','ejs');
app.set('views','views');

/* ROUTES */
const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');
app.use('/admin',adminRoutes);
app.use(shopRoutes);


/* APP REQUEST */
app.use((req,res,next) =>{
    next();
})

/* ERROR HANDLING */ 
app.use(errorController.errorHand);


/* SERVER CONNECTION */
mongoConnect( client =>{
    app.listen(port);
    console.log(`conectado a ${port}`);
});
// const http = require('http'); //creacion server
// const route = require('./routes');
// console.log(route.someText);
const path = require('path');
const express = require('express');
const bodyParser= require('body-parser');
const errorController = require('./controlers/error');
const app = express(); 
var PORT = process.env.PORT || 5000;

var http = require('http');
var server = http.Server(app);

app.set('view engine','ejs');
app.set('views','views');

//Usamos templates, js, ejs/jade/handlebars


const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');


app.use(bodyParser.urlencoded({extended:false}));
app.use(express.static(path.join(__dirname,'public')));

app.use('/admin',adminRoutes);
app.use(shopRoutes);

app.use(errorController.errorHand);






//Creacion server
// const server = http.createServer(app);
// server.listen(3000);

server.listen(PORT, p => console.log('chat running'));
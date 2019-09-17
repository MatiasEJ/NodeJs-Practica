// const http = require('http'); //creacion server
// const route = require('./routes');
// console.log(route.someText);
const path = require('path');
const express = require('express');
const bodyParser= require('body-parser');
const app = express(); 
app.set('view engine','ejs');
app.set('views','views');


const adminData = require('./routes/admin');
const shopRoutes = require('./routes/shop');


app.use(bodyParser.urlencoded({extended:false}));

app.use(express.static(path.join(__dirname,'public')));

app.use('/admin',adminData.routes);
app.use(shopRoutes);

app.use((req,res,next)=>{
    res.status(404).render('404',{pageTitle:'Page Not Found'});
});





//Creacion server
// const server = http.createServer(app);
// server.listen(3000);

app.listen(3000);
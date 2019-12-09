// const http = require('http'); //creacion server
// const route = require('./routes');
// console.log(route.someText);
const path = require('path');
const express = require('express');
const bodyParser= require('body-parser');
const errorController = require('./controlers/error');

const sequelize = require('./util/db');
const Product = require('./model/product');
const User = require('./model/user');

const app = express(); 




app.set('port',(process.env.PORT || 3000));
app.set('view engine','ejs');
app.set('views','views');

// db.execute('SELECT * FROM products')
//     .then((result)=>{console.log(result);})
//     .catch(err=>{ console.log(err);})


//Usamos templates, js, ejs/jade/handlebars


const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');


app.use(bodyParser.urlencoded({extended:false}));
app.use(express.static(path.join(__dirname,'public')));
/**RETRIEVE USER**/
app.use((req,res,next)=>{
    User.findByPk(1)
    .then(user=>{
        
        req.user= user;
        next();
    })
    .catch(err=>console.log(err));
});

app.use('/admin',adminRoutes);
app.use(shopRoutes);

app.use(errorController.errorHand);






/** RELACIONES **/
Product.belongsTo(User,{ constraints: true, onDelete: 'CASCADE' });
User.hasMany(Product);


//Creacion server
// const server = http.createServer(app);
// server.listen(3000);

sequelize
    // .sync({ force: true})
    .sync()
    .then(()=>{
        
        return User.findByPk(1);
       
        
    })
    .then(user=>{
        if(!user){
            return User.create({nombre: 'matias', email: 'texto@gmail.com'})
        }
            return Promise.resolve(user);
        
    })
    .then(user =>{
        
        app.listen(app.get('port'),function () {
            console.log('Node running on port',app.get('port'));
            
            
        });
    })
    .catch(err=>{console.log(err)});


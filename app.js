// const http = require('http'); //creacion server
// const route = require('./routes');
// console.log(route.someText);
//Usamos templates, js, ejs/jade/handlebars

require('dotenv').config()
const path = require('path');
const express = require('express');
const errorController = require('./controlers/error');
const app = express();
const bodyParser = require('body-parser');
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


/* APP REQUEST */
app.use((req, res, next) => {
    User.findById('5e778682a4517c2714d87323')
        .then(user => {
            console.log("USUARIO: ",user.name)
            req.user = user;
            next();
        })
        .catch((e) => console.log("error en request usuario", e));

})


app.use('/admin', adminRoutes);
app.use(shopRoutes);

/* ERROR HANDLING */
app.use(errorController.errorHand);


/* SERVER CONNECTION */
mongoose
    .connect(process.env.DIR_MONGO, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    })
    .then(result => {
        console.clear();
        User.findOne().then(user => {
            if (!user) {
                const user = new User({
                    name: "max",
                    email: "max@test.com.ar",
                    cart: {
                        items: []
                    }
                });
                user.save();
            }
        })
        console.log(`Conectado a puerto: ${port}`)

        app.listen(port);

    })
    .catch(err => console.log("Error en conexion: ", err))
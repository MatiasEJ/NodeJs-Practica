const mongodb = require('mongodb');
const getDb = require('../util/mongodb').getDb;

const ObjectId = mongodb.ObjectId;

class User {
    constructor(username, email, cart, id){
        this.name = username;
        this.email = email;
        this.cart = cart;
        this._id = id;
    }

    save(){
        const db = getDb();
        return db.collection('users')
        .insertOne(this);
        // .then(result =>{
        //     console.log("Usuario salvado");
        // })
        // .catch(err => console.log("Error en Usuario salvado"+err) );
      
    }

    addToCart(product){
        // const cartProducts = this.cart.items.finIndex( cp => {
        //     return cp._id === product._id;
        // });
        const updatedCart = {items:[{...product, quantity: 1}]}
        const db = getDb();
        return db.collection('users').updateOne(
            { _id: new ObjectId(this._id)},
            { $set: { cart: updatedCart}}
        );
    }

    static findById(userId){
        const db = getDb();
        return db.collection('users')
        .findOne({_id: new ObjectId(userId)});
    //     .then(usuario =>{
    //         console.log("EL Usuario ",usuario)
    //         return usuario;
    //     })
    //     .catch(err=>console.log("error en encontrar usuario: ",err));
    }
}

module.exports = User;
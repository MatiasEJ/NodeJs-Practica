const mongodb = require('mongodb');
const getDb = require('../util/mongodb').getDb;

class Product {
    constructor(title, imageUrl, price, description, id, userId){
        this.title = title;
        this.imageUrl = imageUrl;
        this.price = price;
        this.description = description;
        this._id= id ? new mongodb.ObjectId(id) : null;
        this.userId = userId
    }

    save() {
        const db = getDb();
        let dbOp;
        if(this._id){
            dbOp = db.collection('products')
            .updateOne({_id: this._id},{$set: this});
        }else{
            dbOp=db.collection('products').insertOne(this);
        }
        return dbOp.then(result =>{
            console.log("Producto salvado");
        })
        .catch(err => console.log("Error en salvado"+err) );
      
    }

    static fetchAll() {
        const db = getDb();
        return db.
        collection('products')
        .find()
        .toArray()
        .then(products =>{
           
            return products;
        })
        .catch(err=>console.log("error en encontrar todos"+err));
    }

    static findById(prodId){
        const db = getDb();
        return db.collection('products')
        .find({_id: mongodb.ObjectId(prodId)}).next()
        .then(product =>{
           
            return product;
        })
        .catch(err=>console.log("error en encontrar id:",err));
    }
    
    static deleteById(prodId){
        const db = getDb();
        return db.collection('products')
        .deleteOne({_id: new mongodb.ObjectId(prodId)})
        .then(product =>{
            console.log("EL PRODUCTO borrado: ");
            
        })
        .catch(err=>console.log(err));
    }


}

module.exports = Product;
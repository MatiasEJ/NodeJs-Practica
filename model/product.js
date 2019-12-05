
const Cart = require('./cart');
const db = require('../util/db')




module.exports = class Product {
    constructor(id,title, imageUrl, price, description){
        this.id = id;
        this.title = title;
        this.imageUrl = imageUrl;
        this.price = price;
        this.description = description;
        
    }

    save() {
        return db.execute('INSERT INTO products (title,price,imgUrl,description) VALUES (?,?,?,?)',
        [this.title,this.price,this.imageUrl,this.description]
        );
        
    }

    static deleteById(){
       
    }


    static fetchAll() {
       return db.execute('SELECT * FROM products');
    }

    static findById(){
       
    }

}
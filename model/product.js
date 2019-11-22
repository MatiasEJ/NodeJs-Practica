const fs = require('fs');
const path = require('path');
const p = path.join(
    path.dirname(process.mainModule.filename),
    'data',
    'products.json'
);

const getProductsFromFile = (cb) =>{
  
    fs.readFile(p, (err, fileContent) => {
            if (err){
                cb([]);
            } else {
                cb(JSON.parse(fileContent));
            }
    })
}


module.exports = class Product {
    constructor(id,title, imageUrl, price, description){
        this.id = id;
        this.title = title;
        this.imageUrl = imageUrl;
        this.price = price;
        this.description = description;
        
    }

    save() {
        getProductsFromFile(products=>{
            if(this.id){
                const existingProdructIndex = products.findIndex(prod => prod.id === this.id);
                const updatedProducts = [...products];
                updatedProducts[existingProdructIndex] = this;
                fs.writeFile(p,JSON.stringify(updatedProducts),(err)=>{
                    if (err){
                    console.log("error en "+ err);
                    }
                });
            }else{
                this.id = Math.floor((Math.random() * 100) + 1).toString();
                products.push(this);
                fs.writeFile(p,JSON.stringify(products),(err)=>{
                if (err){
                console.log("error en "+ err);
                }
            });
            }
            
        });
        
    }

    static fetchAll(cb) {
       getProductsFromFile(cb);
    }

    static findById(id,cb){
        getProductsFromFile(products => {
            const product = products.find(p => p.id === id );
            cb(product);
        });
    }

}
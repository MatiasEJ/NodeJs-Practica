const fs = require('fs');
const path = require('path');

const p = path.join(
    path.dirname(process.mainModule.filename),
    'data',
    'cart.json'
);

module.exports = class Cart {
    static addProduct(id,prodPrice,title){
        //fetch previuos cart
        fs.readFile(p, (err,fileContent)=>{
            let cart = { products: [], totalPrice: 0 };
            if(!err){
                cart = JSON.parse(fileContent);
            }
            const existingProdIndex = cart.products.findIndex(product => product.id === id);
            const existingProd = cart.products[existingProdIndex];
            let updatedProd;
            if(existingProd){
                updatedProd = {...existingProd};
                updatedProd.qty = updatedProd.qty +1;
                cart.products = [...cart.products];
                cart.products[existingProdIndex] = updatedProd;
            }else{
                updatedProd = {id: id, name: title , qty:1};
                cart.products = [...cart.products,updatedProd];
            }
            cart.totalPrice = parseInt(cart.totalPrice) + + prodPrice;
           
            
            fs.writeFile(p, JSON.stringify(cart),(err) =>{                
                console.log(err);
            });

        })
        //analize car
        

       
        //add new product

    }

    static deleteProduct(id,prodPrice){
        fs.readFile(p, (err,fileContent)=>{
            if(err){
                return;
            }
            const updatedCart = {...JSON.parse(fileContent)};
            const product = updatedCart.products.find(prod => prod.id === id);
            const productQty = product.qty;
            
            updatedCart.products = updatedCart.products.filter(prod => prod.id !== id);
            updatedCart.totalPrice = updatedCart.totalPrice - (prodPrice * productQty);

            fs.writeFile(p, JSON.stringify(updatedCart),(err) =>{                
                console.log(err);
            });

        })
    }

    static getCart(cb){
        fs.readFile(p, (err,fileContent)=>{
            const cart = JSON.parse(fileContent);
            if (err){
                cb(null);
            }else{
                cb(cart);
            }
        });
    }
}


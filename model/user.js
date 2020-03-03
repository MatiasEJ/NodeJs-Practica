const mongodb = require('mongodb');
const getDb = require('../util/mongodb').getDb;

const ObjectId = mongodb.ObjectId;

class User {
    constructor(username, email){
        this.name = username;
        this.email = email;
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
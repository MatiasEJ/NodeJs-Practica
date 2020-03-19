const mongodb = require('mongodb');
const MongoClient = mongodb.MongoClient;

let _db;

const mongoConnect = (callback) => {    
    MongoClient.connect(process.env.DIR_USER,{ useUnifiedTopology: true })
    .then(client => {
        console.log('Connected! to user DB');
        _db = client.db();
        callback(client);
      })
      .catch(err => {
        console.log(err);
        throw err;
      });
  };
  
  const getUserDb = () => {
    if (_db) {
      return _db;
    }
    throw 'No USER database found!';
  };
  
  exports.mongoConnect = mongoConnect;
  exports.getUserDb = getUserDb;
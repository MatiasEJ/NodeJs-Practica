const mongodb = require('mongodb');
const MongoClient = mongodb.MongoClient;

let _db;

const mongoConnect = (callback) => {    
    MongoClient.connect(process.env.DIR_MONGO,{ useUnifiedTopology: true })
    .then(client => {
        console.log('Connected! To TestDB');
        _db = client.db();
        callback(client);
      })
      .catch(err => {
        console.log("->ERROR EN CONEXION <- ",err);
        throw err;
      });
  };
  
  const getDb = () => {
    if (_db) {
      return _db;
    }
    throw 'No database found!';
  };
  
  exports.mongoConnect = mongoConnect;
  exports.getDb = getDb;
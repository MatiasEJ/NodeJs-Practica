const mysql = require('mysql2');

//connection pool for handling multiple connections
const pool = mysql.createPool({
    host: 'localhost',
    user: 'root',
    database: 'node_complete',
    password:'sarasa123456'
});

module.exports = pool.promise();
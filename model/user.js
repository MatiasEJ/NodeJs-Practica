const Sequelize = require('sequelize');
const sequelize = require('../util/db');

const User = sequelize.define('user',{
    id:{
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    nombre:{
        type: Sequelize.STRING
        
    },
    email:{
        type: Sequelize.STRING
       
    }
    
});

module.exports = User;
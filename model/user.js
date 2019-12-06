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
        type: Sequelize.TEXT,
        allowNull: false
    },
    email:{
        type: Sequelize.STRING,
        allowNull: false
    }
    
});

module.exports = User;
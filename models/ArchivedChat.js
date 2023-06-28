const Sequelize = require('sequelize');
const sequelize = require('../util/database');

const Archived_chat = sequelize.define('archived_chat' , {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    userId:Sequelize.INTEGER,
    name: Sequelize.STRING,
    message: Sequelize.STRING,
    
});

module.exports = Archived_chat;
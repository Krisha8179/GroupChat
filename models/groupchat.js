const Sequelize = require('sequelize');
const sequelize = require('../util/database');

const Group_chat = sequelize.define('group_chat' , {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    userId:Sequelize.INTEGER,
    name: Sequelize.STRING,
    message: Sequelize.STRING,
    // fileUrl: Sequelize.STRING,
    
});

module.exports = Group_chat;
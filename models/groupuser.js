const Sequelize = require('sequelize');
const sequelize = require('../util/database');

const Group_user = sequelize.define('group_user' , {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    name: Sequelize.STRING,
    Admin: Sequelize.BOOLEAN, 
    
});

module.exports = Group_user;
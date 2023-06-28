const User = require('../models/user');
const Group = require('../models/group');
const GroupUser = require('../models/groupuser');
const sequelize = require('../util/database');

const { Op } = require('sequelize');

function isStringInvalid(str){
    if(str == undefined || str.length === 0){
        return true
    }
    else{
        return false
    }
}

exports.createGroup = async(req, res) => {
    try{
        groupname = req.body.groupname;
        if(isStringInvalid(groupname)){
            return res.status(400).json({err: "some parameters missing"})
        }

        const createGroup = await Group.create({name: groupname})
        const createGroupUser = await GroupUser.create({name: req.user.name, Admin:true, groupId: createGroup.id, userId: req.user.id})
        res.status(201).json({message: 'group created'})
    }catch(err) {
        console.log(err);
    }
}

exports.getGroups = async(req, res) => {
    try{
        const usergroups = await Group.findAll({
            where: {
              id: {
                [Op.in]: sequelize.literal(
                  `(SELECT DISTINCT groupId FROM group_users WHERE userId = ${req.user.id})`
                ),
              },
            },
          });
        res.status(200).json({usergroups: usergroups});

    }catch(err){
        console.log(err);
    }
}
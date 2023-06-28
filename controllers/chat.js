const User = require('../models/user');
const Group = require('../models/group');
const GroupChat = require('../models/groupchat');
const GroupUser = require('../models/groupuser');
const jwt = require('jsonwebtoken');
require("dotenv").config();


function generateAccessToken(gid, userid, Admin,groupname) {
    return jwt.sign({gId : gid, userid: userid, Admin: Admin,groupname:groupname},`${process.env.JWT_SECRET_KEY}`)
}


function isStringInvalid(str){
    if(str == undefined || str.length === 0){
        return true
    }
    else{
        return false
    }
}

exports.getUsers = async(req, res, next) => {
    try{
        const allUsers = await User.findAll();
        res.status(200).json({allUsers: allUsers})
    }catch(err) {
        console.log(err);
    }
}

exports.getGroupChat = async (req, res) => {
    try{

        const groupid = req.params.groupid;
        const grpObj = await Group.findByPk(groupid);
        const chat = await GroupChat.findAll({where: {groupId: groupid}})
        const userInGroup = await GroupUser.findOne({where: {groupId: groupid, userId: req.user.id}})
        res.status(200).json({groupchatmessages: chat, gtoken: generateAccessToken(groupid, req.user.id, userInGroup.Admin,grpObj.name)});

    }catch(err) {
        console.log(err)
    }
}

exports.addGroupChat = async(req, res) => {
    try{
        const gtoken = req.header('Gauthorization');
        const groupObj = jwt.verify(gtoken, `${process.env.JWT_SECRET_KEY}`);
        const groupobject = await Group.findByPk(groupObj.gId)

        const message = req.body.message;
        const groupmessage = await GroupChat.create({userId:`${req.user.id}`, name:`${req.user.name}`, message: message, groupId: groupobject.id})
        res.status(201).json({message: 'message sent'});

    }catch(err) {
        console.log(err);
    }
}

exports.addGroupUsers = async(req, res) => {
    try{
        const gtoken = req.header('Gauthorization');
        const groupObj = jwt.verify(gtoken, `${process.env.JWT_SECRET_KEY}`);
        const groupobject = await Group.findByPk(groupObj.gId)

        const id = req.body.id;
        const name = req.body.name;
        const addusers = await GroupUser.create({userId:`${id}`, name:`${name}`, role:'member', groupId: groupobject.id}); 
        res.status(201).json({message: 'user added'});

    }catch(err){
        console.log(err);
    }
}

exports.findGroupUser = async(req, res) => {
    try{
        const id = req.body.uid
        const gtoken = req.header('Gauthorization');
        const groupObj = jwt.verify(gtoken, `${process.env.JWT_SECRET_KEY}`);
        const groupobject = await Group.findByPk(groupObj.gId)

        const finduser = await GroupUser.findOne({where:{userId:id, groupId: groupobject.id}});
        if(finduser){
            return res.status(200).json({message:'exists'}) 
        }
        else{
            return res.status(200).json({message:'notexists'})
        } 
    }catch(err){
        console.log(err);
    }
}

exports.getGroupUsers = async(req, res) => {
    try{
        const gtoken = req.header('Gauthorization');
        const groupObj = jwt.verify(gtoken, `${process.env.JWT_SECRET_KEY}`);
        const groupobject = await Group.findByPk(groupObj.gId)

        const findGrpUsers = await GroupUser.findAll({where:{groupId: groupobject.id}})
        res.status(200).json({AllGroupUser: findGrpUsers})
    }catch(err){
        console.log(err);
    }
}

exports.removeGroupUsers = async(req, res) => {
    try{
        const idtoremove = req.body.id;
        const gtoken = req.header('Gauthorization');
        const groupObj = jwt.verify(gtoken, `${process.env.JWT_SECRET_KEY}`);
        const groupobject = await Group.findByPk(groupObj.gId)

        const removeuser = await GroupUser.destroy({where: {groupId: groupobject.id, userId: idtoremove}})
        res.status(200).json({message: 'user removed from group'});
    }catch{
        console.log(err);
    }
}
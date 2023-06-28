const User = require('../models/user');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

function isStringInvalid(str){
    if(str == undefined || str.length === 0){
        return true
    }
    else{
        return false
    }
}

exports.addUser = async (req, res) => {
    console.log(req.body)
    try{
    const name = req.body.name;
    const email = req.body.email;
    const phone_number = req.body.phone_number
    const password = req.body.password;

    if(isStringInvalid(name) || isStringInvalid(email) || isStringInvalid(phone_number) || isStringInvalid(password)){
        return res.status(400).json({err: "some parameters missing"})
    }

    const user = await User.findOne({where: {email: email}})
    if(user){
        return res.status(400).json({err: "User already Exists"})
    }
    const saltrounds = 10;
    bcrypt.hash(password, saltrounds, async(err, hash) => {
        console.log(err)
        await User.create({name, email, phone_number, password: hash})
        res.status(201).json({message: 'User created successfully'});
    })
    } catch(err){
        res.status(500).json({error: err})
    }
}

function generateAccessToken(id,name) {
    return jwt.sign({userId : id, name: name},`${process.env.JWT_SECRET_KEY}`)
}
exports.login = async(req, res, next) => {
    try{
        const email = req.body.email;
        const password = req.body.password;
        if(isStringInvalid(email) || isStringInvalid(password)){
            return res.status(400).json({message: 'Email or password is missing'})
        }

        const user = await User.findOne({ where:{email: email}})
        if(user){
            bcrypt.compare(password, user.password, (err, result) => {
                if(err){
                    throw new Error('Something went wrong')
                }
                if(result === true){
                    res.status(200).json({success: true, message: "User login successful", token: generateAccessToken(user.id, user.name)})
                }
                else{
                    res.status(400).json({success: false, message: "Password Incorrect"})
                }
            })
            }
            else{
                res.status(404).json({success: false, message: "User not found"})
            }
        }
     catch(err){
        res.status(500).json({
            error: err 
        })
    }
}

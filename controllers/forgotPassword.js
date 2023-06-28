const User = require('../models/user');
const ForgotPassword = require('../models/forgotPassword');
const Sib = require('sib-api-v3-sdk')
const uuid = require('uuid');
const bcrypt = require('bcrypt');


require("dotenv").config();
const client = Sib.ApiClient.instance
const apiKey = client.authentications['api-key']
apiKey.apiKey = process.env.SIB_API_KEY
const tranEmailApi = new Sib.TransactionalEmailsApi()


exports.forgotPassword = async (req, res) => {
    try{
        const email = req.body.Email;
        const user = await User.findOne({where: {email}});
        if(user){
            const id = uuid.v4();
            await user.createForgotpassword({id: id, IsActive: true});
        const sender = {
            email: `${process.env.SENDER_MAIL}`,
        }
        const receivers = [
            {
                email: email
            },
        ]


    tranEmailApi
    .sendTransacEmail({
        sender,
        to: receivers,
        subject: 'Forgot Password',
        textContent:`click on the link to reset password`,
        htmlContent: `<a href="http://localhost:3000/password/resetPassword/${id}">Reset Password</a>`
    })
    return res.status(200).json({message: 'Password link sent to mail ', success: true})
    }
    else{
        throw new Error('user does not exist')
    }

    }catch(err){
        console.log(err);
    }
}

exports.resetPassword = async(req, res) => {
    try{
    const id = req.params.id;
    const forgotPasswordRequest = await ForgotPassword.findOne({where: { id}})
    if(forgotPasswordRequest){
        await forgotPasswordRequest.update({IsActive: false});
        res.status(200).send(`<html>
                                <form action="/password/updatePassword/${id}" method="get">
                                    <label for="newpassword">Enter New password</label>
                                    <input name="newpassword" type="password" required></input>
                                    <button>reset password</button>
                                </form>
                            </html>`)
    res.end()
    }
    }catch(err){
        console.log(err);
    }
}

exports.updatePassword = async(req, res) => {
    try{
        const { newpassword } = req.query;
        const  resetpasswordid  = req.params.resetPasswordid;
        const resetpasswordrequest = await ForgotPassword.findOne({where: {id: resetpasswordid}})
        const user = await User.findOne({where: {id: resetpasswordrequest.userId}})
        if (user) {
            const saltRounds = 10;
            bcrypt.genSalt(saltRounds, function(err, salt) {
                if(err){
                    console.log(err);
                    throw new Error(err);
                }
                bcrypt.hash(newpassword, salt, async function(err, hash) {
                    if(err){
                        console.log(err);
                        throw new Error(err);
                    }
                    await user.update({password: hash})
                    res.status(201).json({message: 'password updated'})
                })
            })
            
        }
        else{
            return res.status(404).json({error: 'user not exists'})
        }
    }catch(err){
        console.log(err);
    }
}

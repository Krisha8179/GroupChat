const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const cors = require('cors');
const sequelize = require('./util/database');
const http = require('http');
const { Server } = require('socket.io');
const AWS = require('aws-sdk')
const S3Services = require('./services/S3services');
const cron = require("node-cron");

const jwt = require('jsonwebtoken');
require("dotenv").config();

const userRoutes = require('./routes/user');
const chatRoutes = require('./routes/chat');
const userAuthenticate = require('./middleware/auth');
const groupRoutes = require('./routes/group');
const forgotPasswordRoutes = require('./routes/forgotPassword');

const User = require('./models/user');
const Group = require('./models/group');
const Groupchat = require('./models/groupchat');
const ArchivedChat = require('./models/ArchivedChat');
const Groupuser = require('./models/groupuser');
const ForgotPassword = require('./models/forgotPassword')
const Chatparticipant = require('./models/chatParticipant')

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    maxHttpBufferSize: 100 * 1024 * 1024, // 100 MB
  });

app.use(cors());
app.use(bodyParser.json({extended: false}));

app.use(userRoutes);
app.use(groupRoutes);
app.use(chatRoutes);
app.use(forgotPasswordRoutes);

app.use((req, res) => {
    console.log('url is:', req.url);
    res.sendFile(path.join(__dirname, `Frontend/${req.url}`));
})

cron.schedule("59 23 * * *", async function() {
    try{
        const DATE_START = new Date().setHours(0, 0, 0, 0);
        const DATE_END = new Date().setHours(23, 59, 59, 0);

        const chatMessages = await Groupchat.findAll({
            where: {
                createdAt: { 
                    [Op.gt]: DATE_START,
                    [Op.lt]: DATE_END
                }
            }
        });

        await ArchivedChat.bulkCreate(chatMessages);

        await Groupchat.destroy({
            where: {
                createdAt: { 
                    [Op.gt]: DATE_START,
                    [Op.lt]: DATE_END
                }
            }
        });

        console.log("cron job is successfull");


    }catch(err){
        if(err){
            console.log("cron job failed!");
        }
    }
});

io.on('connection', socket => {
    
    console.log(socket.id)

        socket.on('joinGroup', async(userid,gId,room) => {
            const groups = await Group.findAll();
            groups.forEach( async (group) => {
                const isMember = await Groupuser.findOne({where:{userId : userid, groupId: group.id}});
            
                if (isMember) {
                    socket.join(`${room}`);
                }
            });
        });

    socket.on('join-message',(username,room) =>{
        socket.to(`${room}`).emit('receive-joinMessage',`${username} has joined`);
    })

    socket.on('send-message', async(message,gId,room) => {
        const group = await Group.findByPk(gId)
        socket.to(`${room}`).emit('receive-message', message)
    })
    
    socket.on('file', async(Data,gId,room) => {
        const buffer = Buffer.from(Data.data);
        const fileName = `${Date.now()}${Data.name}`;
        const fileUrl = await S3Services.uploadToS3(buffer, fileName);
        socket.to(`${room}`).emit('fileUrl', fileUrl);

    });   

})

Group.belongsToMany(User, {through: Groupuser});
User.belongsToMany(Group, {through: Groupuser});

User.hasMany(ForgotPassword);
ForgotPassword.belongsTo(User);


Groupchat.belongsToMany(User, {through: Chatparticipant});
User.belongsToMany(Groupchat, {through: Chatparticipant});

Groupchat.belongsTo(Group);

sequelize
.sync()
.then(result => {
    //console.log(result);
    server.listen(3000);
})
.catch(err => {
    console.log(err);
});
const express = require('express');
const router = express.Router();

const chatController = require('../controllers/chat');
const userAuthenticate = require('../middleware/auth');

router.get('/user/get-users',userAuthenticate.authenticate, chatController.getUsers);

router.get('/group/get-users',userAuthenticate.authenticate, chatController.getGroupUsers);
router.post('/group/add-chat',userAuthenticate.authenticate, chatController.addGroupChat);
router.post('/group/add-users',userAuthenticate.authenticate, chatController.addGroupUsers)
router.post('/group/remove-users',userAuthenticate.authenticate, chatController.removeGroupUsers)
router.get('/group/get-chat/:groupid',userAuthenticate.authenticate,chatController.getGroupChat);
router.use('/group/find-user',userAuthenticate.authenticate, chatController.findGroupUser)


module.exports = router;
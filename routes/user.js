const express = require('express');
const router = express.Router();

const userController = require('../controllers/user');

router.post('/user/signup', userController.addUser);
router.post('/user/login', userController.login);

module.exports = router;
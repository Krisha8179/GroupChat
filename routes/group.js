const express = require('express');
const router = express.Router();

const groupController = require('../controllers/group');
const userAuthenticate = require('../middleware/auth');

router.post('/group/create-group',userAuthenticate.authenticate, groupController.createGroup);
router.get('/group/get-groups',userAuthenticate.authenticate, groupController.getGroups);

module.exports = router;
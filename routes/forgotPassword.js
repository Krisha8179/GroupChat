const express = require('express');
const router = express.Router();

const forgotPasswordController = require('../controllers/forgotPassword');

router.get('/password/updatePassword/:resetPasswordid', forgotPasswordController.updatePassword);
router.get('/password/resetPassword/:id', forgotPasswordController.resetPassword);
router.post('/password/forgotpassword', forgotPasswordController.forgotPassword);

module.exports = router;
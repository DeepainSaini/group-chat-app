const express = require('express');
const router = express.Router();
const userController = require('../controller/userController');

router.get('/signup',userController.getSignUpPage);
router.post('/signup',userController.postUserDetails);
router.get('/login',userController.getLoginPage);
router.post('/login',userController.getUserDetails);
router.get('/chat',userController.getChatPage);

module.exports = router;
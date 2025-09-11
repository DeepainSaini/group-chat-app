const express = require('express');
const router = express.Router();
const userAuthentication = require('../middlewares/auth');
const userController = require('../controller/userController');

router.get('/signup',userController.getSignUpPage);
router.post('/signup',userController.postUserDetails);
router.get('/login',userController.getLoginPage);
router.post('/login',userController.getUserDetails);
router.get('/chatpage',userController.getChatPage);
router.post('/chat',userAuthentication.authenticate,userController.addChats);
router.get('/chat',userAuthentication.authenticate,userController.getChats);

module.exports = router;
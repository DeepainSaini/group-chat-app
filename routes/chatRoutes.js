const express = require('express');
const router = express.Router();
const userAuthentication = require('../middlewares/auth');
const userController = require('../controller/userController');
const chatController = require('../controller/chatController');

router.get('/chatpage',userController.getChatPage);
router.post('/chat',userAuthentication.authenticate,chatController.addChats);
router.get('/chat',userAuthentication.authenticate,chatController.getChats);

module.exports = router;
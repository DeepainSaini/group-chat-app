const express = require('express');
const router = express.Router();
const userAuthentication = require('../middlewares/auth');
const groupController = require('../controller/groupController');

router.post('/create',userAuthentication.authenticate,groupController.createGroup);
router.get('/get',userAuthentication.authenticate,groupController.getGroups);

router.post('/search',userAuthentication.authenticate,groupController.searchGroup);
router.post('/join',userAuthentication.authenticate,groupController.joinGroup);

router.get('/chat',userAuthentication.authenticate,groupController.getGroupChat);




module.exports = router;
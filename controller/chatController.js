const path = require('path');
const { User,Chat,sequelize } = require('../models');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { Op } = require('sequelize');


const getChatPage = (req,res) => {
     
    res.sendFile(path.join(__dirname,'../','views','chat.html'))
}

const addChats = async (req,res) => {

    try{
        const {message} = req.body;
        const chat = await Chat.create({

            content : message,
            UserId : req.user.id
        })

        res.status(200).json({message: "message added",chat});

    }catch(error){
        
        console.log(error);
        res.status(500).json({message: "something went wrong"});
    }

}

const getChats = async (req,res) => {

    try{

        const chats = await Chat.findAll({
           
            include: [{ model: User, attributes: ['id', 'name']}],
            order: [['createdAt', 'ASC']]
        });
        res.status(200).json({message: "sent chats",chats})

    }catch(error){

        console.log(error);
        res.status(500).json({message: "someting went wrong"});
    }

}


module.exports = {
    getChatPage,
    addChats,
    getChats,
    
}
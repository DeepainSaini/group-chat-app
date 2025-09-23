const path = require('path');
const { User,Chat,sequelize,Groups, GroupMembers } = require('../models');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { Op } = require('sequelize');

const createGroup = async (req,res) => {

    try{
        const {groupName} = req.body;
        const group = await Groups.findOne({where: {name: groupName}});

        if(group){
            return res.status(400).json({message: "Group already exists"});
        }

        const newGroup = await Groups.create({name: groupName, createdBy: req.user.id});
        await GroupMembers.create({groupId: newGroup.id, userId: req.user.id});
        res.status(201).json({message: "Group created successfully",groupName: groupName,groupId: newGroup.id});
        
    }catch(error){
        console.error("Error creating group:", error);
        return res.status(500).json({message: "Internal server error"});
    }
}

const getGroups = async (req,res) => {

    try{
        const myGroups = await Groups.findAll({where: {createdBy: req.user.id}});
        const joinedGroups = await GroupMembers.findAll(
            {where: {userId: req.user.id}, 
            include: [{model: Groups, as: 'group',attributes: ['name']}]
        });
        res.status(200).json({message: "Groups fetched successfully",myGroups,joinedGroups});
    }
    catch(error){
        console.error("Error fetching groups:", error);
        return res.status(500).json({message: "Internal server error"});
    }
}

const searchGroup = async (req,res) => {
    try{
        const {groupCode} = req.body;
        const group = await Groups.findOne({where: {name: groupCode}});
        if(!group){
            return res.status(400).json({message: "Group not found"});
        }
        console.log("grouppppppppppp",group);
        res.status(200).json({message: "Group fetched successfully",group});
    }
    catch(error){
        console.error("Error fetching group:", error);
        return res.status(500).json({message: "Internal server error"});
    }
}

const joinGroup = async (req,res) => {

    try{

        const {groupId} = req.body;
        const group = await Groups.findByPk(groupId);
        // if(!group){
        //     return res.status(400).json({message: "Group not found"});
        // }
        
        const groupMember = await GroupMembers.findOne({where: {groupId: groupId, userId: req.user.id}});
        if(groupMember){
            return res.status(200).json({message: "You are already a member of this group"});
        }
        
        await GroupMembers.create({groupId: groupId, userId: req.user.id});
        res.status(200).json({message: "Group joined successfully"});
    }catch(error){
        console.error("Error joining group:", error);
        return res.status(500).json({message: "Internal server error"});
    }
}

const getGroupChat = async (req,res) => {

    try{
        const {groupId} = req.query;
        const group = await Groups.findByPk(groupId);
        if(!group){
            return res.status(400).json({message: "Group not found"});
        }
        const messages = await Chat.findAll({
            where: {groupId: groupId},
            include: [{model: User, as: 'user', attributes: ['id', 'name','email']}],
            order: [['createdAt', 'ASC']]
        });
        res.status(200).json({message: "Group chat fetched successfully",messages});
    }
    catch(error){
        console.error("Error fetching group chat:", error);
        return res.status(500).json({message: "Internal server error"});
    }
}

module.exports = {
    createGroup,
    getGroups,
    searchGroup,
    joinGroup,
    getGroupChat
}
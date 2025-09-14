const path = require('path');
const { User,Chat,sequelize } = require('../models');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { Op } = require('sequelize');

const getSignUpPage =  (req,res) => {
    res.sendFile(path.join(__dirname,'../','views','signup.html'));
}

const postUserDetails = async (req,res) => {
    
    const t = await sequelize.transaction();

    try{

        const {name,email,number,password} = req.body;
        let user = await User.findOne(
            {where : {
               
                [Op.or]:[
                    {email : email}, 
                    {phoneNumber: number}
                ]

            }});

        if(!user){
            
            const hashedPassword = await bcrypt.hash(password,10);
            user = await User.create({
                
                name : name,
                email : email,
                phoneNumber : number,
                password : hashedPassword

            },{transaction : t});

            await t.commit();
            res.status(201).json({message : "User Created Successfully."});
        }
        else{
             
            if(user.email === email && user.phoneNumber === number){
                res.status(409).json({message : "USER ALREADY EXISTS"});
            }
            else if(user.email === email){
                res.status(409).json({message : "USER WITH THIS EMAIL ALREADY EXISTS"});
            }
            else{
                res.status(409).json({message : "USER WITH THIS PHONE NUMBER ALREADY EXISTS"});
            }
             
        }

    }catch(error){
        
        console.log("ERROR OCCURED: ",error);
        await t.rollback();
        res.status(500).json({message : "Something Went Wrong"});
    }
}

const getLoginPage = async (req,res) => {

    res.sendFile(path.join(__dirname,'../','views','login.html'));
}

function generateAccessToken(id){

    return jwt.sign({userId : id},process.env.JWT_KEY);
}

const getUserDetails = async (req,res) => {

    
    try{
       
        const {email,number,password} = req.body;
        const user = await User.findOne({

            where: {
                [Op.or]:[
                    {email : email}, 
                    {phoneNumber: number}
                ]
            }
        });
    
        if(!user){
            
            return res.status(401).json({message: "user does not exist please signup"})
        }
        else if(user.email !== email && user.phoneNumber !== number){
           
            return res.status(401).json({message : "user does not exist please signup"});
        }
        else if(user.email === email && user.phoneNumber !== number){
            
            return res.status(401).json({message : "phone number doesn't match this email"});
        }
        else if(user.email != email && user.phoneNumber === number){
            
            return res.status(401).json({message : "email not registered please sign up"});
        }
        
        const isMatch = await bcrypt.compare(password,user.password);
    
        if(!isMatch){
            return res.status(401).json({message : "Incorrect Password"});
        }

        res.status(200).json({message : "User Found Successfully", token : generateAccessToken(user.id)});

    }catch(error){
        console.log(error);
        res.status(500).json({message : "Something Went Wrong"});
    }
   

}

const searchEmail = async (req,res) => {

    try{
        const {email} = req.body;
        const user = await User.findOne({where:{email:email}});
        if(!user){
            return res.status(404).json({message: "user not found"});
        }

        res.status(200).json({message: "user found"});

    }catch(error){
        console.log(error);
        res.status(500).json({message: "something went wrong"});
    }
}



module.exports = {
    getSignUpPage,
    postUserDetails,
    getLoginPage,
    getUserDetails,
    searchEmail
}
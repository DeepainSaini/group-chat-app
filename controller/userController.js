const path = require('path');
const { User,sequelize } = require('../models');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const getSignUpPage =  (req,res) => {
    res.sendFile(path.join(__dirname,'../','views','signup.html'));
}

const postUserDetails = async (req,res) => {
    
    const t = await sequelize.transaction();

    try{

        const {name,email,number,password} = req.body;
        let user = await User.findOne({where : {email : email}, transaction : t});

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

             res.status(409).json({message : "EMAIL ALREADY EXISTS"});
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
        const user = await User.findOne({where : {email : email}});
    
        if(!user){
           
            return res.status(401).json({message : "User Does Not Exist"});
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


module.exports = {
    getSignUpPage,
    postUserDetails,
    getLoginPage,
    getUserDetails
}
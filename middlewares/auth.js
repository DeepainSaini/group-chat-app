const jwt = require('jsonwebtoken');
const { User } = require('../models');
require('dotenv').config();

const authenticate = async (req,res,next) => {

    try{
        const token  =  req.header('Authorization');
        // if(!token){
        //     return res.redirect('/user/login');
        // }
        const user = jwt.verify(token,`${process.env.JWT_KEY}`);
        await User.findByPk(user.userId).then((user)=>{
            req.user = user;
            next();
        })


    }catch(error){
        console.log(error);
        res.status(400).json({status : false});
    }
}

module.exports = {
    authenticate
}
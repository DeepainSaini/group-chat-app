const jwt = require('jsonwebtoken');
const {User} = require('../models');

module.exports = (io) => {

    

    io.use(async (socket,next)=>{
        
        try{
            const token  =  socket.handshake.auth.token;
            console.log(token);
            if(!token){
                return next(new Error("Unauthorized"));
            }
            const decoded = jwt.verify(token,`${process.env.JWT_KEY}`);
            const user = await User.findByPk(decoded.userId);
            
            if(!user){
                return next(new Error("Unauthorized"));
            }

            socket.user = user;
            next();

        }catch(error){
            console.log(error);
            next(new Error("Unauthorized"));
        }
    });
}
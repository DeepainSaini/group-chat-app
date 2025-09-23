const {Chat} = require('../../models');

module.exports = (socket,io) => {
    
    socket.on("join-room",(roomName)=>{
        socket.join(roomName);
    })

    socket.on("new-messages",async ({message,roomName},callback)=>{
       
        try{

            console.log("user",socket.user.name,"said",message,"in room",roomName);

        
            const chat = await Chat.create({
                content : message,
                UserId : socket.user.id,
                roomName : roomName
            });

            io.to(roomName).emit("new-messages",{
                username: socket.user.name,
                email:socket.user.email,
                message:message,
                createdAt: chat.createdAt
            });

            if(callback){
                callback({success: true});
            }

        }catch(error){
            console.log(error);
            if(callback){
                callback({success: false});
            }
        }
        
        
    });
}
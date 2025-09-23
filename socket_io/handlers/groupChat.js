const {Chat,Groups,GroupMembers} = require('../../models');

module.exports = (socket,io) => {
    
    socket.on("join-group",(groupId)=>{
        socket.join(groupId);


    })

    socket.on("new-messages",async ({message,groupId},callback)=>{
       
        try{
            console.log("user",socket.user.name,"said",message,"in group",groupId);

            const group = await Groups.findByPk(groupId);
            
            if(!group){
                return callback({success: false});
            }

            const groupMember = await GroupMembers.findOne({where: {groupId: groupId, userId: socket.user.id}});

            if(!groupMember){
                return callback({success: false});
            }
        
            const chat = await Chat.create({
                content : message,
                UserId : socket.user.id,
                groupId : groupId
            });
            
            
    
            io.to(groupId).emit("new-messages",{
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
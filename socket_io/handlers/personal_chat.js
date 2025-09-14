
module.exports = (socket,io) => {
    
    socket.on("join-room",(roomName)=>{
        socket.join(roomName);
    })

    socket.on("new-messages",(message,roomName)=>{
       
        console.log("user",socket.user.name,"said",message);
        io.to(roomName).emit("new-messages",{username: socket.user.name,message:message});
    });
}
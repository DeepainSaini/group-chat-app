
module.exports = (socket,io) => {

    socket.on("chat-messages",(message)=>{
        console.log("user",socket.user.name,"said",message);
        io.emit("chat-messages",{username: socket.user.name,message:message});
    });
}
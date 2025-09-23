const { Server } = require('socket.io');
const socketAuth = require('./middleware');
const chatHandler = require('./handlers/chat');
const personalChatHandler = require('./handlers/personal_chat');
const groupChatHandler = require('./handlers/groupChat');

module.exports = (server) => {

    const io = new Server(server,{
        cors:{
            origin:
            process.env.NODE_ENV === "production"?false:["http://localhost:3000"],
        }
    });

    socketAuth(io);

    const connectedUsers = new Map();

    io.on("connection",(socket)=>{
        console.log('a user connected',socket.id);
        const userId = socket.user.id;
        if(!connectedUsers.has(userId)){
            connectedUsers.set(userId,socket.id);
        }
        else{
            connectedUsers.set(userId,socket.id);
        }

        chatHandler(socket,io);
        personalChatHandler(socket,io);
        groupChatHandler(socket,io);

        socket.on("disconnect",()=>{
            connectedUsers.delete(socket.user.id);
        })
      
    })
}
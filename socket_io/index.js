const { Server } = require('socket.io');
const socketAuth = require('./middleware');
const chatHandler = require('./handlers/chat');
const personalChatHandler = require('./handlers/personal_chat');

module.exports = (server) => {

    const io = new Server(server,{
        cors:{
            origin:
            process.env.NODE_ENV === "production"?false:["http://localhost:3000"],
        }
    });

    socketAuth(io);

    io.on("connection",(socket)=>{
        console.log('a user connected',socket.id);
        chatHandler(socket,io);
        personalChatHandler(socket,io);
      
    })
}
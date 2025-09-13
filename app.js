const express  = require('express');
const http = require('http');
const jwt = require('jsonwebtoken');
const { Server } = require('socket.io');
const userRoute = require('./routes/userRoutes');
const chatRoute = require('./routes/chatRoutes');
const app  = express();

const server = http.createServer(app);
const io = new Server(server);


const db = require('./models');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

app.use('/user',userRoute);
app.use('/user',chatRoute);

io.use(async (socket,next)=>{
     
    try{
        const token  =  socket.handshake.auth.token;
        console.log(token);
        if(!token){
            return next(new Error("Unauthorized"));
        }
        const decoded = jwt.verify(token,`${process.env.JWT_KEY}`);
        const user = await db.User.findByPk(decoded.userId);
        
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

io.on("connection",(socket)=>{
    console.log('a user connected',socket.id);
    socket.on("chat-messages",(message)=>{
        console.log("user",socket.user.name,"said",message);
        io.emit("chat-messages",{username: socket.user.name,message:message});
    });
})

db.sequelize.sync({force:false}).then(()=>{
    server.listen(3000,(err)=>{
        console.log('Server is running on port 3000');
        console.log('WebSocket server is ready');
    });
}).catch((err)=>{
    console.log(err);
});


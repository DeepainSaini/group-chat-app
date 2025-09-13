const express  = require('express');
const http = require('http');
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

io.on("connection",(socket)=>{
    console.log('a user connected',socket.id);
    socket.on("chat-messages",(message)=>{
        io.emit("chat-messages",message);
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


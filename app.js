const express  = require('express');
const http = require('http');
const websocket = require('ws');
const userRoute = require('./routes/userRoutes');
const chatRoute = require('./routes/chatRoutes');
const app  = express();

const server = http.createServer(app);
const wss = new websocket.Server({server});


const db = require('./models');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

app.use('/user',userRoute);
app.use('/user',chatRoute);

let sockets = [];

wss.on('connection',(ws)=>{

    sockets.push(ws);

    ws.on('message',(message)=>{
        sockets.forEach((socket)=>{
            const messageString  = message.toString();
            socket.send(messageString);
        });
    })

    ws.on('close',()=>{
        sockets = sockets.filter((socket)=>{
            socket !==ws;
        });
    })
})

db.sequelize.sync({force:false}).then(()=>{
    server.listen(3000,(err)=>{
        console.log('Server is running on port 3000');
        console.log('WebSocket server is ready');
    });
}).catch((err)=>{
    console.log(err);
});


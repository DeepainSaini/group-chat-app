const express  = require('express');
const http = require('http');
const userRoute = require('./routes/userRoutes');
const chatRoute = require('./routes/chatRoutes');
const groupRoute = require('./routes/groupRoutes');
const socketIo = require('./socket_io');
const app  = express();

const server = http.createServer(app);

const db = require('./models');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

socketIo(server);

app.use('/user',userRoute);
app.use('/user',chatRoute);
app.use('/group',groupRoute);


db.sequelize.sync({force:false}).then(()=>{
    server.listen(3000,(err)=>{
        console.log('Server is running on port 3000');
        console.log('WebSocket server is ready');
    });
}).catch((err)=>{
    console.log(err);
});


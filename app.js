const express  = require('express');
const userRoute = require('./routes/userRoutes');
const app  = express();

const db = require('./models');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

app.use('/user',userRoute);

db.sequelize.sync({force:false}).then(()=>{
    app.listen(3000,(err)=>{
        console.log('server is running');
    });
}).catch((err)=>{
    console.log(err);
});


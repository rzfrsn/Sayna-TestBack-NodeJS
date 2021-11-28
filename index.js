const express = require('express');
const app = express();
const mongoose = require('mongoose');
const dotenv = require('dotenv');
//Import Routes
const defaultRoute = require('./routes/default');
const authRoute = require('./routes/auth');
const userRoute = require('./routes/user');

dotenv.config();

//DB connexion
mongoose.connect(
    process.env.DB_CONNECT,
    { UseNewUrlParser: true },
    () => console.log('connected to the DB')
);

//Middlewares
app.use(express.json());

//Routes
app.use('/api/', 
    defaultRoute, 
    authRoute, 
    userRoute
);

app.listen(3000, () => {
    console.log("Server is running :D");
})
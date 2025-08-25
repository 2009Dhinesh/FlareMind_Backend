const express = require('express');

const app = express();

const cors = require('cors');

const DB = require('./dataBase/DB')
require('dotenv').config();

const userRouter = require('./Routers/userRouter');

app.use(cors());
app.use(express.json());

app.use('/user' , userRouter);

DB();

app.get('/' , (req ,res)=>{
    res.send("Hello Wolrd!");
    console.log("Hello World")
    });


app.listen(process.env.PORT || 8081 , ()=>console.log(`Server Run On Port : ${process.env.PORT}`));

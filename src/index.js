require('dotenv').config();
const express=require("express");
const app=express();
const cors=require("cors");
require("./db/conn");
const bodyParser = require('body-parser');
const cookieParser=require("cookie-parser");
const Blogrouter=require("./routers/blogroutes");
const Userrouter=require("./routers/userroutes");

const port=process.env.PORT || 5000;

app.use(express.json());
app.use(cors());
app.use(cookieParser());
app.use(bodyParser.json());
app.use(express.urlencoded({extended:false}));

app.use(Blogrouter);
app.use(Userrouter);

app.get("/",(req,res)=>{
    res.send("connection established");
})

app.listen(port,(req,res)=>{
    console.log(`Server running at ${port}`);
})
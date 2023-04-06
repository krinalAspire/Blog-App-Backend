require('dotenv').config();
const express=require("express");
const app=express();
const cors=require("cors");
require("./db/conn");
const Register=require("./models/users");
const Blog=require("./models/blog");
const bodyParser = require('body-parser');
const bcrypt=require("bcryptjs");
const auth=require("./middleware/auth");
const cookieParser=require("cookie-parser");

const port=process.env.PORT || 5000;

app.use(express.json());
app.use(cors());
app.use(cookieParser());
app.use(bodyParser.json());
app.use(express.urlencoded({extended:false}));

app.get("/",(req,res)=>{
    res.send("connection established");
})

app.post("/users",async (req,res)=>{
    try{
        const user=new Register(req.body);
        const token=await user.generateAuthToken();
        
        // res.cookie("jwt",token,{
        //     // expires:new Date(Date.now()+3000),
        //     httpOnly:true
        // });
        const createUser= await user.save();
        res.status(201).send(createUser);
    }catch(e){
        res.status(400).send(e)
    }
    
})

app.get("/users",async (req,res)=>{
    try{
        const userData=await Register.find();
        res.status(201).send(userData);
    }catch(e){
        res.status(400).send(e);
    }
})

app.get("/home",auth,(req,res)=>{
    res.send("succesfull");
})

app.get("/blogs", async(req,res)=>{
    try{
        const blogData=await Blog.find();
        res.status(201).send(blogData);
    }catch(e){
        res.status(400).send(e);
    }
})

app.post("/blogs",async (req,res)=>{
    try{
        const blog=new Blog(req.body);
        const createBlog= await blog.save();
        res.status(201).send(createBlog);
    }catch(e){
        res.status(400).send(e)
    }
    
})

app.get("/blogs/:id",async(req,res)=>{
    try{
        const _id=req.params.id;
        const blogData=await Blog.findById(_id );
        res.status(201).send(blogData);
    }catch(e){
        res.status(400).send(e);
    }
})

app.get("/users/:id",async(req,res)=>{
    try{
        const _id=req.params.id;
        const userData=await Register.findById(_id);
        res.status(201).send(userData);
    }catch(e){
        res.status(400).send(e);
    }
})

app.patch("/blogs/:id",async(req,res)=>{
    try{
        const _id=req.params.id;
        const updateBlog=await Blog.findByIdAndUpdate(_id, req.body,{
            new:true
        });
        res.status(201).send(updateBlog);
    }catch(e){
        res.status(400).send(e);
    }
})

app.patch("/users/:id",async(req,res)=>{
    try{
        const _id=req.params.id;
        const updateUser=await Register.findByIdAndUpdate(_id, req.body,{
            new:true
        });
        res.status(201).send(updateUser);
    }catch(e){
        res.status(400).send(e);
    }
})

app.delete("/users/:id",async(req,res)=>{
    try{
        const deleteUser=await Register.findByIdAndDelete(req.params.id);
        if(!req.params.id){
            return res.status(400).send();
        }
        res.status(201).send(deleteUser);
    }catch(e){
        res.status(400).send(e);
    }
})

app.delete("/blogs/:id",async(req,res)=>{
    try{
        const deleteBlog=await Blog.findByIdAndDelete(req.params.id);
        if(!req.params.id){
            return res.status(400).send();
        }
        res.status(201).send(deleteBlog);
    }catch(e){
        res.status(400).send(e);
    }
})

app.post('/login', async(req,res)=>{
    const {userid, password} = req.body;
try{
    const userId = await Register.findOne({userid:userid})
    const isMatch = await bcrypt.compare(password, userId.password)
    const token = await userId.generateAuthToken()

    if(isMatch){
        res.status(201).json({token:token , data:userId});
    }
    else{
        res.status(400).send(error)
    }
} 
catch(e){
    res.send(e)
}
})

app.listen(port,(req,res)=>{
    console.log(`Backend running at ${port}`);
})
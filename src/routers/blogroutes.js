const express=require("express");
const router = new express.Router();
const Blog=require("../models/blog");
const auth=require("../middleware/auth");

router.get("/blogs", async(req,res)=>{
    try{
        const blogData=await Blog.find();
        res.status(201).send(blogData);
    }catch(e){
        res.status(400).send(e);
    }
})

router.post("/blogs",async (req,res)=>{
    try{
        const blog=new Blog(req.body);
        const createBlog= await blog.save();
        res.status(201).send(createBlog);
    }catch(e){
        res.status(400).send(e)
    }
    
})

router.get("/blogs/:id",async(req,res)=>{
    try{
        const _id=req.params.id;
        const blogData=await Blog.findById(_id );
        res.status(201).send(blogData);
    }catch(e){
        res.status(400).send(e);
    }
})

router.patch("/blogs/:id",async(req,res)=>{
    try{
        const _id=req.params.id;
        const updateBlog=await Blog.findByIdAndUpdate(_id, req.body,{
            new:true
        });
        // console.log(updateBlog);
        res.status(201).send(updateBlog);
    }catch(e){
        res.status(400).send(e);
    }
})

router.delete("/blogs/:id",async(req,res)=>{
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

module.exports=router;
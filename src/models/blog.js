const mongoose=require("mongoose");

const blogSchema=new mongoose.Schema({
    blogid:{
        type:Number
    },
    title:{
        type:String,
        required:true
    },
    description:{
        type:String,
        required:true
    },
    author:{
        type:String,
        required:true,
    },
    category:{
        type:String,
        required:true,
    }
});

const Blog=new mongoose.model("Blog",blogSchema);

module.exports=Blog;
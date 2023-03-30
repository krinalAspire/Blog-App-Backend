const jwt=require("jsonwebtoken");
const Register=require("../models/users");

const auth=async(req,res, next)=>{
    try{
       const token=req.cookies.jwt;
       const verifyUser=jwt.verify(token,process.env.SECRET_KEY);
       console.log(verifyUser);
       const user=await Register.findOne({_id:verifyUser._id});
       console.log(user);

       req.token=token;
       req.user=user;
        if(user.role !== "admin"){
            return res.status(400).json({message:"Authorize first as admin"})
        }
       next();
    }catch(e){
       res.status(400).send(e);
    }
    
}

module.exports=auth;
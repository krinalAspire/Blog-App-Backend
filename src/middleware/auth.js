const jwt=require("jsonwebtoken");
const Register=require("../models/users");

const auth=async(req,res, next)=>{
    try{

   //  const token = req.header("Authorization")?.replace("Bearer ",'')
   //  console.log("fv",token);
       const token=req.cookies.jwt;
       const verifyUser=jwt.verify(token,process.env.SECRET_KEY);
      //  console.log(verifyUser);
       const user=await Register.findOne({_id:verifyUser._id});
      //  console.log(user);

       req.token=token;
       req.user=user;
      //   if(user.role === "admin"){
      //       return res.status(201).send("succesfull login admin");
      //   }else{
      //       return res.status(201).send("succesfull login user");
      //   }
       next();
    }catch(e){
       res.status(400).send(e);
    }
    
   // const token = req.header("Authorization")?.replace("Bearer ",'')
   //  // console.log("fv",token);
   //  if(!token){
   //      return res.status(400).json({message:"user not authorized"})
   //  }
   //  try{
   //      const verifyUser = jwt.verify(token, process.env.SECRET_KEY)
   //      const user = await Register.findOne({_id: verifyUser._id})
   //      // console.log("fgf",user);
   //      req.user = user._id
   //      if(user.role !== "admin"){
   //          return res.status(400).json({message:"Authorize first as admin"})
   //      }
   //      next();
   //  }catch(e){
   //      res.status(401).json({msg:"server error", data: e})
   //  }
}
// }

module.exports=auth;
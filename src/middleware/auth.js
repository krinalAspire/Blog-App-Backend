const jwt=require("jsonwebtoken");
const Register=require("../models/users");

const auth=async(req,res, next)=>{
    try{
   //  const token = req.header("Authorization")?.replace("Bearer" + '')
    const token = req.headers.authorization.split(' ')[1];
   //  console.log("fv",token);/
       const verifyUser=jwt.verify(token,process.env.SECRET_KEY);
      //  console.log("verifyuser",verifyUser);
       const user=await Register.findOne({_id:verifyUser._id});
      //  console.log("verifieduser",user);

       req.token=token;
       req.user=user;
       next();
    }catch(error){
      //  res.status(400).send(e);
      // console.log(error.message);
      res.status(419).json({ msg: error.message });
      //  res.status(419).json({ msg:"token expired"});
    }
}

module.exports=auth;
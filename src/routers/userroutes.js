const express=require("express");
const router = new express.Router();
const Register=require("../models/users");
const bcrypt=require("bcryptjs");
const jwt=require("jsonwebtoken");
const nodemailer=require("nodemailer");
const auth = require("../middleware/auth");

//email config
const transporter=nodemailer.createTransport({
    service:"gmail",
    auth:{
        user:process.env.EMAIL,
        pass:process.env.PASSWORD
    }
})

router.post("/users",async (req,res)=>{
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

router.get("/users",auth,async (req,res)=>{
    try{
        const userData=await Register.find();
        res.status(201).send(userData);
    }catch(e){
        res.status(400).send(e);
    }
})

router.get("/users/:id",async(req,res)=>{
    try{
        const _id=req.params.id;
        const userData=await Register.findById(_id);
        res.status(201).send(userData);
    }catch(e){
        res.status(400).send(e);
    }
})

router.patch("/users/:id",async(req,res)=>{
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

router.delete("/users/:id",async(req,res)=>{
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

router.post('/login', async(req,res)=>{
    const {userid, password} = req.body;
try{
    const userId = await Register.findOne({userid:userid})
    const isMatch = await bcrypt.compare(password, userId.password)
    const token = await userId.generateAuthToken()
    const refreshToken=await jwt.sign({_id:userId._id}, process.env.REFRESH_JWT_SECRET, {
            expiresIn: "1d",
        });

    const User= await Register.findByIdAndUpdate(userId._id,{
        refreshtoken:refreshToken,
    })

    if(isMatch){
        res.status(201).json({token:token , data:User, refreshtoken:refreshToken});
    }
    else{
        res.status(400).send(error)
    }
} 
catch(e){
    res.send(e)
}
})


//send email link for reset password
router.post("/sendpasswordlink", async(req,res)=>{
    // console.log(req.body);
    const {email}=req.body;

    if(!email){
        res.status(401).json({status:401, message:"Enter your Email"})
    }

    try{
       const userFind=await Register.findOne({email:email});
    //    console.log("userfind", userFind)
    
    //token generate for reset password
    const token=jwt.sign({_id:userFind._id},process.env.SECRET_KEY,{
        expiresIn:"120s"
    })
    //    console.log("token",token)   

    const setuserToken=await Register.findByIdAndUpdate({_id:userFind._id},{verifytoken:token},{new:true})
    // console.log("setusertoken",setuserToken);

    if(setuserToken){
        const mailOptions={
            from:process.env.EMAIL,
            to:email,
            subject:"sending email for password reset",
            text:`This Link Valid For 2 minutes http://localhost:3000/forgotpassword/${userFind.id}/${setuserToken.verifytoken}`,
        }

        transporter.sendMail(mailOptions,(error,info)=>{
            if(error){
                console.log("error",error);
                res.status(401).json({status:401,message:"email not send"})
            }else {
                console.log("Email sent",info.response);
                res.status(201).json({status:201,message:"Email sent Succesfully"} )
            }
        })
    }
    }catch(e){
        res.status(401).json({status:401,message:"Invalid User"})
    }
})

//varify user for forgot password time
router.get("/forgotpassword/:id/:token", async(req,res)=>{
    const {id,token}=req.params;
    // console.log(id,token);

    try{
        const validuser=await Register.findOne({_id:id,verifytoken:token});
        // console.log(validuser);

        const verifyToken=jwt.verify(token,process.env.SECRET_KEY);
        // console.log(verifyToken)
        if(validuser && verifyToken._id){
            res.status(201).json({status:201,validuser})
        }else {
            res.status(401).json({status:401, message:"user not exist"})
        }
    }catch(e){
        res.status(401).json({status:401,e})
    }
})

//change Password
router.post("/:id/:token", async(req,res)=>{
    const {id,token}=req.params;

    const {password}=req.body;

    try{
        const validuser=await Register.findOne({_id:id,verifytoken:token});

        const verifyToken=jwt.verify(token,process.env.SECRET_KEY);
        
        if(validuser && verifyToken._id){
            const newPassword=await bcrypt.hash(password,10)
            const setnewPass=await Register.findByIdAndUpdate({_id:id},{password:newPassword})

            setnewPass.save();
            res.status(201).json({status:201,setnewPass})
        }else {
            res.status(401).json({status:401, message:"user not exist"})
        }
    }catch(e){
        res.status(401).json({status:401,e})
    }
})

//refresh-token
router.post("/refresh-token", async(req,res)=>{
    // try{
    //     const id=req.body._id;
    //     console("userid",id)

    //     const userData=await Register.findById({_id:id});

    //     if(userData){
             
    //     }else{
    //         res.status(400).send({success:false, message:"User Not Found"})
    //     }
    // }catch(e){
    //     res.status(400).send({success:false, message:error.message})
    // }
    try {
        const refreshToken = req.body?.refreshtoken
        console.log(refreshToken);
        if (!refreshToken) {
            return res.status(404).json({ msg: "Token not Found" })
        }
        const decoded = jwt.verify(refreshToken, process.env.REFRESH_JWT_SECRET)
        const user = await Register.findOne({refreshtoken:refreshToken})
        console.log(user);
        if (!user) {
            return res.status(404).json({ msg: "User not Found" })
        }
        // console.log(decoded.user);
        // if (user._id !== decoded.user) {
        //     return res.status(401).json({ msg: "User Not Authorize" })
        // }

        const payload = {
            user: user._id,
        };

        const token = jwt.sign(payload, process.env.SECRET_KEY, {
            expiresIn: "10s",
        });
        console.log("new token",token);
        
        res.status(200).json({ msg:"New Token sended successfully", token: token })

    } catch (error) {
        res.status(500).json({ msg: error.message })
    }
})

module.exports=router;
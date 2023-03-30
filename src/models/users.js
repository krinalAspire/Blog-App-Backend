const mongoose=require("mongoose");
const bcrypt=require("bcryptjs");
const jwt=require("jsonwebtoken");

const userSchema=new mongoose.Schema({
    userid:{
        type:String,
        required:true
    },
    role:{
        type:String
    },
    name:{
        type:String,
        required:true
    },
    password:{
        type:String,
        required:true
    },
    cpassword:{
        type:String
    },
    email:{
        type:String,
        required:true,
    },
    phone:{
        type:Number,
        required:true,
    },
    country:{
        type:String,
        required:true
    },
    address:{
        type:String,
        required:true
    },
    gender:{
        type:String,
        required:true
    },
    tokens:[{
        token:{
            type:String,
            required:true
        }
    }]
});
//generating tokens
userSchema.methods.generateAuthToken= async function(){
    try{
        const token=jwt.sign({_id:this._id.toString()}, process.env.SECRET_KEY);
        this.tokens=this.tokens.concat({token:token})
        // console.log(token);
        await this.save();
        return token;
    }catch(e){
         res.send(e);
         console.log(e);
    }
}

//converting password into hash
userSchema.pre("save",async function(next){
    //  const passwordHash=await bcrypt.hash(password,10);
    if(this.isModified("password")){
        // console.log(`the current password is ${this.password}`);
        this.password=await bcrypt.hash(this.password,10);
    }
     next();
});

const Register=new mongoose.model("Register",userSchema);

module.exports=Register;
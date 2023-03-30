const mongoose = require("mongoose");

mongoose.connect("mongodb://localhost:27017/Blog")
.then(()=>{
    console.log("Connection Succesful");
}).catch(()=>{
    console.log("No Connection");
});
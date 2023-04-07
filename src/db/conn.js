const mongoose = require("mongoose");

const DB="mongodb+srv://krinalsonara78:krinal@cluster0.upr0kge.mongodb.net/Blog?retryWrites=true&w=majority";

mongoose.connect(DB)
.then(()=>{
    console.log("Connection Succesful");
}).catch(()=>{
    console.log("No Connection");
});
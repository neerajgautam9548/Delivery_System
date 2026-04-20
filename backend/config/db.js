const mongoose=require("mongoose");
require("dotenv").config();
// const mongodb_atlas_uri=require("../config/development.json").MONGODB_URI

// console.log("MongoDB URI : ", mongodb_atlas_uri);
const mongodb_atlas_uri=process.env.MONGO_URI;
console.log(process.env.MONGO_URI);

const connectDB=async ()=>{
    try{
        await mongoose.connect(mongodb_atlas_uri)
        console.log("MongoDB connected Successfully");
    } catch(err){
        console.log("Error Occur : ", err);
    } 
}

module.exports=connectDB;

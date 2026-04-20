const express=require("express");
const app=express();
require("dotenv").config();
const connectDB=require("./config/db");
connectDB();
app.get("/",(req,res)=>{
    res.send("chal raha hai");
})

app.listen(3000,(req,res)=>{
    console.log("server is running on port 3000");
})
import express from "express"
import mongoose from "mongoose";
import userRouter from "./Routers/userRouter.js";
import jwt from "jsonwebtoken"
import productRouter from "./Routers/productRouter.js";

const mongouri ="mongodb+srv://admin:kQ2MCO8IRCq57Zat@cluster0.ibvekme.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"

mongoose.connect(mongouri).then(()=>{
    console.log("mongodb is connected");
});

const app =express();

app.use((req,res,next)=>{
    const authHeader= req.header("Authorization");
    if(authHeader != null){
        const token = authHeader.replace("Bearer ","")
        
        console.log(token);

        jwt.verify(token,"secretkey123",(error,content)=>{
            if(content==null){
                res.json({
                    message:"invalid token"
                })
            }else{
                console.log(content);
                req.user=content
                next()    
            }
        })
}else{
    next()}
})

app.use(express.json());

app.listen(3000,()=>{
    console.log("Server is runing");
    
});

app.use("/user",userRouter)
app.use("/product",productRouter)
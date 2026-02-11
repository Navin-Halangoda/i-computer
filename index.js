import express from "express"
import mongoose from "mongoose";
import userRouter from "./Routers/userRouter.js";
import jwt from "jsonwebtoken"
import productRouter from "./Routers/productRouter.js";
import cors from "cors";
import dotenv from "dotenv"
import orderRouter from "./Routers/orderRoueter.js";
import messageRouter from "./Routers/messageRouter.js";
dotenv.config();

const mongouri =process.env.MONGOURI
mongoose.connect(mongouri).then(()=>{
    console.log("mongodb is connected");
});

const app =express();
app.use(cors());
app.use(cors({
  origin: "http://localhost:5173",
}));

app.use((req,res,next)=>{
    const authHeader= req.header("Authorization");
    if(authHeader != null){
        const token = authHeader.replace("Bearer ","")
        
        console.log(token);

        jwt.verify(token,process.env.JWT_SECRET,(error,content)=>{
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

app.use("/api/user",userRouter)
app.use("/api/product",productRouter)
app.use("/api/orders",orderRouter)
app.use("/api/messages", messageRouter)
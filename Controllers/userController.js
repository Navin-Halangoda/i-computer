import axios from "axios";
import User from "../Models/User.js";
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken";
import nodemailer from 'nodemailer';
import dotenv from "dotenv";
import Otp from "../Models/otp.js";
dotenv.config();


const transport = nodemailer.createTransport({
    service:"gmail",
    host:"smtp.gmail.com",
    port:587,
    secure:false,
    auth:{
        user:"shancreation62@gmail.com",
        pass:process.env.GMAIL_APP_PASSWORD,
    }
})


export function createUser(req,res){
    const data = req.body;
    const hasedpassword = bcrypt.hashSync(data.password,10);
    const user=new User(
        {
            email:data.email,
            firstName:data.firstName,
            lastName:data.lastName,
            password:hasedpassword,
        }
    );
    user.save().then(
        ()=>{
            res.json(
                {message:"User create succefully"}
            )
        }
    )
}

export function loginUser(req,res){
    const email = req.body.email;
    const password = req.body.password
    User.find({email:email}).then(
        (users)=>{
            if (users[0]==null){
                res.status(500).json({
                    message:"User not found"
                })
            }else{
                const user= users[0];
                if(user.isBlocked){
                    res.status(501).json({
                        message:"user is blocked"
                        
                    })
                    return
                }
                const isPasswordCorrect= bcrypt.compareSync(password,user.password)
                if(isPasswordCorrect){
                    const paylod={
                        email:user.email,
                        firstName:user.firstName,
                        lastName:user.lastName,
                        role:user.role,
                        isEmailVarified:user.isEmailVerified,
                        image:user.image,
                    }
                    const token= jwt.sign(paylod,process.env.JWT_SECRET,{
                        expiresIn:"50h"
                    })
                    res.json({message:"login is succesfully",
                        token:token,
                        role:user.role,
                    })
                }
                
            }
            
        }
    )
}

export function getUser(req,res){
    if(req.user== null){
        res.json({message:"Unauthorize user"})
        return
    }

    if(req.user.role !="admin"){
        res.json({
            message:"only can read by admin"
        })
        return
    }

    User.find().then(
        (user)=>{
            res.json(user)
        }
    )
}

export function getuser(req,res){
    if(req.user== null){
        res.status(401)({
            message:"unauthorized"
        })
        return
    }
    res.json(req.user)
}

export async function googleloging(req,res){
    try{
        const response = await axios.get(
            "https://www.googleapis.com/oauth2/v3/userinfo",
            {
                headers: {
                Authorization: `Bearer ${req.body.token}`,
                },
            }
            );
        const user =  await User.findOne({email:response.data.email})
        if(user==null){
            const newUser = new User({
                email:response.data.email,
                firstName:response.data.given_name,
                lastName:response.data.family_name,
                password:123,
                image:response.data.picture,
            })
            await newUser.save();
             const paylod={
                        email:newUser.email,
                        firstName:newUser.firstName,
                        lastName:newUser.lastName,
                        role:newUser.role,
                        isEmailVarified:true,
                        image:newUser.image,
                    }
                     const token= jwt.sign(paylod,process.env.JWT_SECRET,{
                        expiresIn:"50h"
                    })
                    res.json({message:"login is succesfully",
                        token:token,
                        role:newUser.role,
                    })


        }else{
            if(user.isBlocked){
                    res.status(501).json({
                        message:"user is blocked"
                    })
                    return
                }
            const paylod={
                        email:user.email,
                        firstName:user.firstName,
                        lastName:user.lastName,
                        role:user.role,
                        isEmailVarified:user.isEmailVerified,
                        image:user.image,
                    }
                    const token= jwt.sign(paylod,process.env.JWT_SECRET,{
                        expiresIn:"50h"
                    })
                    res.json({message:"login is succesfully",
                        token:token,
                        role:user.role,
                    })

        }
        
    }catch(err){
        res.status(500).json({
           message:"Google loging failed" ,
           err:err.message
        })
    }
    
}


export async function sendotp(req,res){

try{
const email= req.params.email;

const user =await User.findOne({
    email:email
})

if(user==null){
    res.status(404).json({
        message:"user not found"
    })
    return
}
await Otp.deleteMany({
    email:email
})

const otpcode= Math.floor(100000+Math.random()*900000).toString()

const otp= new Otp({
    email:email,
    otp:otpcode
})

await otp.save();

const message={
    from:"shancreation62@gmail.com",
    to:email,
    subject:"your otp code",
    text:"your otp code is"+ otpcode
}
transport.sendMail(message,(err,info)=>{
    if(err){
        res.status(500).json({
            message:"Failed to send OTP",
            error:err.message
        })
    }else{
        res.json({
            message:"OTP sent succefully"
        })
    }
})}catch(error){
    res.status(401).json({
        message:"failed to send otp",
        error:error.message
    })
}

}

export async function updatepassword(req,res){
    try{
    const otp= req.body.otp;
    const email=req.body.email
    const newpassword=req.body.password

    const otprecord = await Otp.findOne({email:email, otp:otp});
    
    if(otprecord==null){
        res.status(404).json({
            message:"Invalid otp"
        })
        return;
    }
    await Otp.deleteMany({email:email})

    const hassedpassword = bcrypt.hashSync(newpassword,10)

    await User.updateOne({email:email},{$set:{password:hassedpassword,isEmailVerified:true}})
    res.json({
        message:"password update succefuly"
    })

}catch(error){
    res.status(500).json({
        message:"password update fail"
    })
}

}

export async function toogleBlocked(req,res){
    try{
      if(req.user== null){
        res.json({message:"Unauthorize user"})
        return
    }

    if(req.user.role !="admin"){
        res.json({
            message:"only can read by admin"
        })
        return
    }
    const email = req.params.email;

    if(req.user.email===email){
        res.json({
            message:"do not block own email"
        })
        return
    }
    
    const isBlocked= req.body.isBlocked
    
    await User.updateOne({email:email},{isBlocked:isBlocked})
        res.json({
            message:"status update succefully"})
    }catch(error){
    res.status(500).json({
        message:"update failed",
        error:error.message
    })}

}
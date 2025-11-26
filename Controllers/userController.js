import axios from "axios";
import User from "../Models/User.js";
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken";


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
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
            role:data.role,
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
                res.json({
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
                    const token= jwt.sign(paylod,"secretkey123",{
                        expiresIn:"3h"
                    })
                    res.json({message:"login is succesfully",
                        token:token
                    })
                }else{
                    res.status(401).json({message:"invalid password"})
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
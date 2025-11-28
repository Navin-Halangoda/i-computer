import express from "express";
import { createUser, getuser, getUser, googleloging, loginUser, sendotp, toogleBlocked, updatepassword } from "../Controllers/userController.js";

const userRouter = express.Router();

userRouter.post("/",createUser);
userRouter.post("/loginuser",loginUser)
userRouter.get("/",getUser)
userRouter.get("/getuser",getuser)
userRouter.post("/googleloging",googleloging)
userRouter.get("/send-otp/:email",sendotp)
userRouter.post("/updatepassword",updatepassword)
userRouter.post("/toggle-block/:email",toogleBlocked)

export default userRouter;
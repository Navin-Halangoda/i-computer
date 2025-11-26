import express from "express";
import { createUser, getuser, getUser, googleloging, loginUser } from "../Controllers/userController.js";

const userRouter = express.Router();

userRouter.post("/",createUser);
userRouter.post("/loginuser",loginUser)
userRouter.get("/",getUser)
userRouter.get("/getuser",getuser)
userRouter.post("/googleloging",googleloging)

export default userRouter;
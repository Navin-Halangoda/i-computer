import express from "express";
import { createUser, getUser, loginUser } from "../Controllers/userController.js";

const userRouter = express.Router();

userRouter.post("/",createUser);
userRouter.post("/loginuser",loginUser)
userRouter.get("/",getUser)

export default userRouter;
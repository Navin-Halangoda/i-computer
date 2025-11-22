import express from 'express'
import { createorder, getorder, updateorderstatus } from '../Controllers/orderController.js';


const orderRouter = express.Router();

orderRouter.post("/",createorder)
orderRouter.get("/",getorder)
orderRouter.put("/:orderId",updateorderstatus)

export default orderRouter;
import express from 'express'
import { createorder, getorder } from '../Controllers/orderController.js';

const orderRouter = express.Router();

orderRouter.post("/",createorder)
orderRouter.get("/",getorder)

export default orderRouter;
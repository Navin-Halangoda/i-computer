import Order from "../Models/order.js";
import Product from "../Models/Product.js";
import { isAdmin } from "./productControlle.js";

export async function createorder(req,res){
    if(req.user==null){
        res.status(401).json({
            message:"unothrized"
        })
        return;
    }
    try{
        const latestOrder = await Order.findOne().sort({date:-1})

        let orderId ="ORD000001"

        if(latestOrder!= null){
            let latestOrderId = latestOrder.orderId;
            let laterOrderNumberString= latestOrderId.replace("ORD","");
            let latestOrderNumber =parseInt(laterOrderNumberString);

            let neworderNumber = latestOrderNumber+1
            let newOrderNumberString = neworderNumber.toString().padStart(6,"0")
            orderId= "ORD"+newOrderNumberString
        }
        
        

        const items=[]
        let total=0

        for(let i=0; i<req.body.items.length;i++){
            const product = await Product.findOne({productId:req.body.items[i].productId})
            if(product== null){
                res.status(400).json({
                    message:`product with id ${req.body.items[i].productid} not found`
                })
            }
            
            items.push({
                productId:product.productId,
                name:product.name,
                price:product.price,
                quantity:req.body.items[i].quantity,
                image:product.images[0],
                phone:req.body.phone
            })
            
            total += product.price*req.body.items[i].quantity
              
        }
          let name = req.body.name
            if(name== null){
               name= req.user.firstName+" "+req.user.lastName 
            }

            

            const neworder =new Order({
                orderId:orderId,
                email: req.user.email,
                name:name,
                address:req.body.address,
                total:total,
                items:items
            })

            await neworder.save()

            res.json({
                message:"order placed succefuly",
                orderId:orderId
            })
        
    }catch(error){
        return res.status(500).json({
            message:"Error placing order",
            error:error.message
        })
    }
}

export async function getorder(req,res){
    if(!req.user==null){
        res.status(401).json({
            message:"unauthorized"
        });
        return
    }

    if(isAdmin(req)){
        const orders= await Order.find().sort({date:-1})
        res.json(orders)
    }else{
        const orders= await Order.find({email:req.user.email}).sort({date:-1})
        res.json(orders)
    }
}

export async function updateorderstatus(req,res){
    if(!isAdmin(req)){
        res.status(401).json({
            message:"unauthorized"
        });
        return;
    }
    try{
        const orderId = req.params.orderId
        const status=req.body.status
        const notes = req.body.notes

        await Order.updateOne(
            {orderId:orderId},
            {status:status,
                notes:notes
            }
        )
        res.json({
            message:"order status updated succefuly"
        })

    }catch(error){
        res.status(500).json({
            message:"Error updating order status",
            error:error.message
        });
    }
}
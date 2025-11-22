import mongoose from "mongoose";

const orderschema= new mongoose.Schema(
    {
        orderId:{
            type:String,
            required:true,
            unique:true
        },
        email:{
            type:String,
            required:true
        },
        name:{
            type:String,
            required:true
        },
        address:{
            type:String,
            required:true
        },
        date:{
            type:Date,
            required:true,
            default:Date.now
        },
        total:{
            type:Number,
            required:true,
        },
        status:{
            type:String,
            requied:true,
            default:"pending"
        },
        notes:{
            type:String,
            required:false
        },
        phone:{
            type:String,
            required:false
        },
        items:[
            {
                productId:{
                    type:String,
                    required:true
                },
                name:{
                    type:String,
                    required:true
                },
                price:{
                    type:Number,
                    required:true
                },
                quantity:{
                    type:Number,
                    required:true
                },
                image:{
                    type:String,
                    required:true
                }
            }
        ]


    }
    
)
const Order = mongoose.model("order",orderschema);

export default Order;
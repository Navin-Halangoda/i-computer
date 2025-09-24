import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
    {
        productId:{
            type:String,
            required:true,
            unique:true
        },
        name:{
            type:String,
            required:true
        },
        altname:{
            type:[String],
            default:[]
        },
        description:{
            type:String,
            required:true
        },
        price:{
            type:Number,
            required:true
        },
        lablledPrice:{
            type:Number,
            required:true
        },
        brand:{
            type:String,
            default:"no brand",
            required:true
        },
        stock:{
            type:Number,
            default:0,
            required:true
        },
        isAvailable:{
            type:Boolean,
            default:true
        }
    }
)

const Product = mongoose.model("product",productSchema);

export default Product;


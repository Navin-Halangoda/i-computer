import Product from "../Models/Product.js";

export function createPorduct(req,res){

    if(!isAdmin(req)){
        res.status(403).json({
            message:"forbidden"
        })
    return
    }
   
    const product = new Product(req.body)

    product.save().then(
        ()=>{
            res.json({
                message:"product added succesfully"
            })
        }
     ).catch(
        (error)=>{
            res.status(500).json({
                message:"error creating product",
                error:error.message
            })
        }
    )
    }

export function gettAllProducts(req,res){
    if(isAdmin(req)){
        Product.find().then((product)=>{
            res.json(product)
        }).catch((error)=>{
            res.json({
                message:"Error fethching data",
                error:error.message
            })
        })
    }
    Product.find({isAvailable:true}).then((product)=>{
        res.json(product)}).catch((error)=>{
            res.json({
                message:"Error fethching data",
                error:error.message
            })
    })
}


export function deleteProduct(req, res) {
    if (!isAdmin(req)) { 
        return res.status(403).json({
            message: "you havent authorization delete user"
        });
    }

    const productID = req.params.productID;

    Product.deleteOne({ productId: productID })
        .then(() => {
            res.json({ message: "Product deleted successfully" });
        })
}

  
export function updateProduct(req,res){
    if(!isAdmin(req)){
        return res.status(403).json({
            message:"you havent autherization"
        })
        
    }
    const productID = req.params.productID

    Product.updateOne({productId:productID},req.body).then(()=>{
       res.json({message:"product update succefully"})
    })
}


export function getProductbyId(req,res){
    const productID= req.params.productID;
    if(!isAdmin(req)){
        Product.findOne({productId:productID,isAvailable:true}).then((product)=>{
            if(product==null){
                res.json("not matching product");
            }else{
                res.json(product);
            }
        }).catch((error)=>{
            res.status(404).json({
                message:"error fethching product",
                error:error.message
            })
        })
    }else{
        Product.findOne({productId:productID}).then((product)=>{
            if(!product){
                res.json({
                    message:"do not matching product"
                })
            }else{
                res.json(product)
            }
        })
    }

}




export function isAdmin(req){
     if(req.user==null){
        return false
    }
    if(req.user.role != "admin"){
        return false
    }
return true
}

export async function searchproduct(req,res){
    const query=req.params.query

    try{
        const product = await Product.find(
            {$or:[
                {name:{$regex:query,$options:"i"}},
                {altname:{$elemMatch:{$regex:query,$options:"i"}}}],
                isAvailable:true
            }
        )
        return res.json(product)
    }catch(error){
        res.status(500).json({
            message:"error serching product",
            error:error.message
         })
    }
}


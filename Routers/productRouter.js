import express from "express";
import { createPorduct, deleteProduct, getProductbyId, gettAllProducts, updateProduct } from "../Controllers/productControlle.js";

const productRouter = express.Router();

productRouter.post("/",createPorduct)
productRouter.get("/",gettAllProducts)
productRouter.delete("/:productID",deleteProduct)
productRouter.put("/:productID",updateProduct)
productRouter.get("/getbyid/:productID",getProductbyId)

export default productRouter;


//eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6InNoYW5ha2FAZ21haWwuY29tIiwiZmlyc3ROYW1lIjoic2hhbiIsImxhc3ROYW1lIjoibmF2aW4iLCJyb2xlIjoiYWRtaW4iLCJpc0VtYWlsVmFyaWZpZWQiOmZhbHNlLCJpbWFnZSI6Ii9kZWZ1bHQuanBnIiwiaWF0IjoxNzU4NTI2Njg1LCJleHAiOjE3NTg1Mzc0ODV9.FDGc424pBV4B_1t4T98kAT6J_bjWLi1xQn3ZXWKbeZI
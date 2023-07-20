import slugify from "slugify";
import fs from "fs";
import productModel from "../models/productModel.js";
import categoyModel from "../models/categoyModel.js";
import braintree from "braintree";
import orderModel from "../models/orderModel.js";
import dotenv from "dotenv";

dotenv.config();

//PAYMENT GATEWAY
var gateway = new braintree.BraintreeGateway({
  environment: braintree.Environment.Sandbox,
  merchantId: process.env.BRAINTREE_MERCHANT_ID,
  publicKey: process.env.BRAINTREE_PUBLIC_KEY,
  privateKey: process.env.BRAINTREE_PRIVATE_KEY,
});

//CREATE PRODUCT CONTROLLER
export const createProductController=async(req,res)=>{
    try{
        const {name,slug,price,description,category,quantity,shipping} =req.fields;
        const {photo}=req.files;
        //VALIDATION
        switch(true){
            case !name:
                return res.status(500).send({error:"Name is required"});
            case !price:
                return res.status(500).send({error:"price is required"});
            case !description:
                return res.status(500).send({error:"description is required"});
            case !category:
                return res.status(500).send({error:"category is required"});        
            case !quantity:
                return res.status(500).send({error:"quantity is required"});
            case photo && photo.size>10000000:
                return res.status(500).send({error:"photo is required and should be less than 1mb"}); 
        }
        
        const products=new productModel({...req.fields,slug:slugify(name)});
        if(photo){
            products.photo.data=fs.readFileSync(photo.path)
            products.photo.contentType=photo.type;
        }
        await products.save();
        res.status(201).send({
            success:true,
            message:"product created successfully",
            products
        })
    }catch(error){
        console.log(error);
        res.status(500).send({
            success:false,
            message:"Error in creating product",
            error
        })
    }
}
// ---------------------------------------------------------------------------
//GET ALL PRODUCTS CONTROLLER
export const getProductController=async(req,res)=>{
    try{
        const products=await productModel.find({}).populate("category").select("-photo").limit(12).sort({createdAt:-1})
        res.status(200).send({
            success:true,
            countTotal:products.length,
            message:"All products",
            products 
        })
    }catch(error){
        console.log(error);
        res.status(500).send({
            success:false,
            message:"Error in getting products",
            error:error.message
        })
    }
}
// ---------------------------------------------------------------------------
//GET SINGLE PRODUCTS CONTROLLER
export const getSingleProductController=async(req,res)=>{
    try{
        const product=await productModel.findOne({slug:req.params.slug}).select("-photo").populate("category");
        res.status(200).send({
            success:true,
            message:"Single Product fetched",
            product
        })
    }catch(error){
        console.log(error);
        res.status(500).send({
            success:false,
            message:"Error in getting single product",
            error
        })
    }
}
// ---------------------------------------------------------------------------
//GET PRODUCT PHOTO CONTROLLER
export const productPhotoController=async(req,res)=>{
    try{
        const product=await productModel.findById(req.params.pid).select("photo");
        if(product.photo.data){
            res.set("Content-type",product.photo.contentType);
            return res.status(200).send(product.photo.data)
        }
    }catch(error){
        console.log(error);
        res.status(500).send({
            success:false,
            message:"Error while getting product photo",
            error
        })
    }
}
// -----------------------------------------------------------------------------------------------
//DELETE PRODUCT CONTROLLER 
export const deleteProductController=async(req,res)=>{
    try{
        await productModel.findByIdAndDelete(req.params.pid).select("-photo");
        res.status(200).send({
            success:true,
            message:"Product deleted successfully",
        })
    }catch(error){
        console.log(error);
        res.status(500).send({
            success:false,
            message:"Error in deleting product",
            error
        })
    }
}
//-----------------------------------------------------------------------------
//UPDATE PRODUCT CONTROLLER
export const updateProductController=async(req,res)=>{
    try{
        const {name,price,description,category,quantity,shipping} =req.fields;
        const {photo}=req.files;
        //VALIDATION
        switch(true){
            case !name:
                return res.status(500).send({error:"Name is required"});
            case !price:
                return res.status(500).send({error:"price is required"});
            case !description:
                return res.status(500).send({error:"description is required"});
            case !category:
                return res.status(500).send({error:"category is required"});        
            case !quantity:
                return res.status(500).send({error:"quantity is required"});
            case photo && photo.size>100000:
                return res.status(500).send({error:"photo is required and should be less than 1mb"}); 
        }
        
        const products=await productModel.findByIdAndUpdate(req.params.pid,
            {...req.fields,slug:slugify(name)},{new:true}
        )
        if(photo){
            products.photo.data=fs.readFileSync(photo.path)
            products.photo.contentType=photo.type;
        }
        await products.save();
        res.status(201).send({
            success:true,
            message:"product updated successfully",
            products
        })
    }catch(error){
        console.log(error);
        res.status(500).send({
            success:false,
            message:"Error in updating product",
            error
        })
    }
}
// --------------------------------------------------------------------------------
//FILTERS
export const productFilterController=async(req,res)=>{
    try{
        const {checked}=req.body
        let args={}
        if(checked.length>0) args.category=checked;
        const products=await productModel.find(args);
        res.status(200).send({
            success:true,
            products,
        })
    }catch(error){
        console.log(error);
        res.status(400).send({
            success:false,
            message:"Error while filtering products",
            error
        })
    }
}
// ---------------------------------------------------------------------------------
// ProductCategoryController
export const ProductCategoryController=async(req,res)=>{
    try{
        const category=await categoyModel.findOne({slug:req.params.slug})
        const products=await productModel.find({category}).populate("category");
        res.status(200).send({
            success:true,
            category,
            products,
        })
    }catch(error){
        console.log(error);
        res.status(400).send({
            success:false,
            message:"Error while getting products",
            error
        })  
    }
}

//PAYMENT GATEWAY CONTROLLER
//TOKEN
export const braintreeTokenController=async(req,res)=>{
    try{
        gateway.clientToken.generate({},function(err,response){
            if(err){
                res.status(500).send(err)
            }
            else res.send(response);
        })
    }catch(error){
        console.log(error);
    }
};
//PAYMENT
export const braintreePaymentController=async(req,res)=>{
    try{
        const {cart,nonce}=req.body
        let total=0;
        cart.map((i)=>{total+=i.price})
        let newTransaction=gateway.transaction.sale({
            amount:total,
            paymentMethodNonce:nonce,
            options:{
                submitForSettlement:true
            }
        },
        function(error,result){
            if(result){
                const order=new orderModel({
                    products: cart,
                    payment: result,
                    buyer: req.user._id,
                }).save()
                res.json({ok:true})
            }
            else res.status(500).send(error);
        }
        )
    }catch(error){
        console.log(error);
    }
};
//cod
export const codPaymentController=(req,res)=>{
    try{
        const {cart}=req.body
        const order=new orderModel({
                    products: cart,
                    payment: {},
                    buyer: req.user._id,
                }).save()
        res.json({ok:true})
    }catch(error){
        console.log(error);
    }
}

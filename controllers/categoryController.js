import categoyModel from "../models/categoyModel.js";
import slugify from "slugify";


//CREATE CATEGORY CONTROLLER
export const createCategoryController=async(req,res)=>{
    try{
        const {name} =req.body;
        if(!name){
            return res.status(401).send({message:"Name is required"});
        }
        //CHECK EXISTING CATEGORY
        const existingCategory=await categoyModel.findOne({name});
        if(existingCategory){
            return res.status(200).send({success:true,message:"Category already exists"})
        }
        const category=await new categoyModel({name,slug:slugify(name)}).save();
        res.status(201).send({
            success:true,
            message:"New category created successfully",
            category
        })
    }catch(error){
        console.log(error);
        res.status(500).send({
            success:false,
            message:"Error in category",
            error
        })
    }
}
// -----------------------------------------------------------------------------------------
//UPDATE CATEGORY CONTROLLER
export const updateCategoryController=async(req,res)=>{
    try{
        const {name}=req.body;
        const {id}=req.params
        const category=await categoyModel.findByIdAndUpdate(id,{name,slug:slugify(name)},{new:true});
        res.status(200).send({
            success:true,
            message:"Category updated successfully",
            category
        })
    }catch(error){
        console.log(error);
        res.status(500).send({
            success:false,
            message:"Error in updating category",
            error
        })
    }
}

// -----------------------------------------------------------------------------------------------
//GET CATEGORY CONTROLLER TO GET ALL CATEGORIES
export const getCategoryController=async(req,res)=>{
    try{
        const category=await categoyModel.find({});
        res.status(200).send({
            success:true,
            message:"All categories list",
            category
        })
    }catch(error){
        console.log(error);
        res.status(500).send({
            success:false,
            message:"Error in getting all categories",
            error
        })
    }
}
// -----------------------------------------------------------------------------------------------
//GET SINGLE CATEGORY CONTROLLER 
export const getSingleCategoryController=async(req,res)=>{
    try{
        const category=await categoyModel.findOne({slug:req.params.slug});
        res.status(200).send({
            success:true,
            message:"Single category fetched successfully",
            category
        })
    }catch(error){
        console.log(error);
        res.status(500).send({
            success:false,
            message:"Error in getting single category",
            error
        })
    }
}
// -----------------------------------------------------------------------------------------------
//DELETE CATEGORY CONTROLLER 
export const deleteCategoryController=async(req,res)=>{
    try{
        const {id}=req.params;
        await categoyModel.findByIdAndDelete(id);
        res.status(200).send({
            success:true,
            message:"category deleted successfully",
        })
    }catch(error){
        console.log(error);
        res.status(500).send({
            success:false,
            message:"Error in deleting category",
            error
        })
    }
}
import express from "express";
import { isAdmin, requireSignIn } from "../middlewares/authMiddleware.js";
import { getCategoryController, createCategoryController, updateCategoryController, getSingleCategoryController,
     deleteCategoryController } from "../controllers/categoryController.js";

//ROUTER OBJECT
const router = express.Router();

//ROUTES
//CREATE CATEGORY
router.post("/create-category",requireSignIn,isAdmin,createCategoryController);
//UPDATE CATEGORY
router.put("/update-category/:id",requireSignIn,isAdmin,updateCategoryController);
//GET ALL CATEGORY
router.get("/get-category",getCategoryController);
//GET SINGLE CATEGORY
router.get("/single-category/:slug",getSingleCategoryController);
//DELETE CATEGORY
router.delete("/delete-category/:id",requireSignIn,isAdmin,deleteCategoryController);




export default router;
import express from "express";
import { isAdmin, requireSignIn } from "../middlewares/authMiddleware.js";
import { ProductCategoryController, braintreePaymentController, braintreeTokenController, codPaymentController, createProductController, 
         deleteProductController, getProductController, getSingleProductController, 
         productFilterController, productPhotoController, updateProductController } 
         from "../controllers/productController.js";
import formidable from "express-formidable";
 
//ROUTER OBJECT
const router = express.Router();

//ROUTES
//CREATE PRODUCT
router.post("/create-product",requireSignIn,isAdmin,formidable(),createProductController);
//GET ALL PRODUCT
router.get("/get-product",getProductController);
//GET SINGLE PRODUCT
router.get("/single-product/:slug",getSingleProductController);
//GET PHOTO
router.get("/product-photo/:pid",productPhotoController);
//DELETE PRODUCT
router.delete("/delete-product/:pid",requireSignIn,isAdmin,deleteProductController);
//UPDATE PRODUCT
router.put("/update-product/:pid",requireSignIn,isAdmin,formidable(),updateProductController)
//PRODUCT FILTER
router.post("/product-filters",productFilterController);
//CATEGORY WISE PRODUCT
router.get("/product-category/:slug",ProductCategoryController);

//PAYMENT ROUTES
//TOKEN
router.get("/braintree/token",braintreeTokenController);
//PAYMENTS
router.post("/braintree/payment",requireSignIn,braintreePaymentController);
//COD
router.post("/payment/cod",requireSignIn,codPaymentController);






export default router;
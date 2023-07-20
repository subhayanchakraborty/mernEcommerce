import express from "express";
import colors from "colors";
import dotenv from "dotenv";
import morgan from "morgan";
import connectDB from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import categoryRoutes from "./routes/categoryRoute.js"
import productRoutes from "./routes/productRoute.js"
import cors from "cors";
import path from "path";

//CONFIGURE DOTENV
dotenv.config();
//DB CONNECTION
connectDB();

const app=express();

//MIDDLEWARES
app.use(cors());
app.use(express.json());
app.use(morgan("dev"));
app.use(express.static(path.join(__dirname,'./client/build')))

//ROUTES
app.use("/api/v1/auth",authRoutes);
app.use("/api/v1/category",categoryRoutes);
app.use("/api/v1/product",productRoutes);


//REST API
app.use('*',function(req,res){
    res.sendFile(path.join(__dirname,'./client/build/index.html'));
})
//PORT
const PORT=process.env.PORT||8080;

//APP LISTEN
app.listen(PORT,()=>{
    console.log(`server is running on port ${PORT}`.bgBlue.white);
})
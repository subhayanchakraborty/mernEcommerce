import mongoose from "mongoose";

//ORDER SCHEMA
const orderSchema = new mongoose.Schema(
  {
    products:[{
        type:mongoose.ObjectId,
        ref:"product",
    }],
    payment:{},
    buyer:{
        type:mongoose.ObjectId,
        ref:"users"
    },
    status:{
        type:String,
        default:"Processed",
        enum:["Processed","Not processed","Shipped","Delivered","canceled"]
    }
  },
  { timestamps: true }
);

export default mongoose.model("Order", orderSchema);
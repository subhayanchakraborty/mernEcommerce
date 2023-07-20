import mongoose from "mongoose";

//USER SCHEMA
const categorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
    },
    slug:{
        type:String,
        lowercase:true,
    }
  },
  { timestamps: true }
);

export default mongoose.model("Category", categorySchema);
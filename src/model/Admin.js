const mongoose = require("mongoose");
const Schema = mongoose.Schema;


const AdminSchema = new Schema(
    {
    name: {
      type: String,
      required: true,
    },
    
    email: {
      type: String,
      unique: true,
      lowercase: true,
    },
    phone: {
      type: String,
    },
    role:{
      type: String,
      enum:['user', 'business', 'admin'],
      default:'user',
      required:true,
    },
    password: {
      type: String,
      required: true,
      select:false,
    },
    
    status: {
      type: String,
      enum: ["active", "suspended", "deleted"],
      default: "active",
    },
    
  },
  {
    timestamps: true,
  }
);


const Admin = mongoose.model("Admin", AdminSchema);

module.exports = Admin;
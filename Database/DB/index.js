const mongoose=require("mongoose");
const userModel=require("../models/User.model");
const productModel=require("../models/Product.model");
const orderModel=require("../models/Order.model");
const categoryModel=require("../models/Category.model");
const SellerModel=require("../models/Seller.model")
const DB=async ()=>{
try{
const connectionInstance=await mongoose.connect(`${process.env.MONGODB_URI}/${process.env.DBName}`);
  console.log(`mongodb connection successfull on !! DB HOST : ${connectionInstance.connection.host}\nwith name of DATABASE : ${process.env.DBNAME}`);
}
catch(err){
    console.log("mongodb connection failed : ", err);
}
}
module.exports={DB,userModel,productModel,orderModel,categoryModel,SellerModel};
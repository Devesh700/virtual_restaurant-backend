const jwt = require("jsonwebtoken");
const SellerModel=require("../Database/models/Seller.model");
const bcrypt=require("bcrypt")

const isloggedIn=(token,key)=>{
    return jwt.verify(token,key);
}


const RegisterUser=async(req,res,next)=>{
    let user;
        try{
        user=await SellerModel.findOne({email:req.body?.email})
        }
        catch(err){
            console.error(err)
            res.json(err);
        }
    if(!user){
        try{
            user=await SellerModel.create({
                email:req.body.email,
                phone:req.body.phone,
                aadharName:req.body.aadharName,
                aadharNumber:req.body.aadharNumber,
                restaurantName:req.body.restaurantName,
                password:req.body.password,
            });
            req.session.user=user;
            let token=user.generateAccessToken();
            res.json({success:true, data:user,msg:"registered successfully",token:token})
        }
        catch(err){
            res.json(err);
        }
    }

    else{
        res.json({success:false,msg:"email id already registered"})
    }    
}


const UpdateUser=async(req,res,next)=>{
    // isloggedIn();
    let user;
        try{
        user=await SellerModel.findOne({_id:req.body?._id})
        }
        catch(err){
            res.json({success:false,error:err,msg:"email not found"});
        }
    if(user){
        try{
            let temp=req.body;
            user=await user.updateOne({
                email:req.body.email,
                phone:req.body.phone,
                aadharName:req.body.aadharName,
                aadharNumber:req.body.aadharNumber,
                restaurantName:req.body.restaurantName,
                password:req.body.password,
            });
            req.session.user=user;
            user=await SellerModel.findOne({_id:req.body._id})
            res.cookie("auth-id",user._id).json({success:true, data:user,msg:"successfully updated"})
        }
        catch(err){
            res.json({success:false,error:err,msg:"error while updating "})
        }
    }

    else{
        res.json({success:false,msg:"email not found"})
    }    
}


const loginUser=async(req,res,next)=>{
    let user;
    try{
        user=await SellerModel.findOne({email:req.body.email});
    }
    catch(err){
        res.json({success:false,msg:"error finding the user please try again"});
    }
    if(user){
        if(await user.isPasswordCorrect(req.body.password)){
            let token=user.generateAccessToken()
            req.session.user=user;
            res.cookie("auth-id",user._id).json({success:true,msg:"logged in successfully",token:token,data:user})
        }
        else{
            res.json({success:false,msg:"please enter correct password"})
        }
    }
    else{
        res.json({success:false,msg:"user with this email doesn't exist"})
    }
}
module.exports={RegisterUser,UpdateUser,loginUser};
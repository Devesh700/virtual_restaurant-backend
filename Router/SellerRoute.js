const { RegisterUser, UpdateUser, loginUser } = require("../Authentication/SellerAuthentication");
const { SellerModel } = require("../Database/DB");

const router=require("express").Router();
router.route("/register").post(RegisterUser);
router.route("/login").post(loginUser);
router.route("/update").put(UpdateUser);
router.get("/getsellers",async(req,res,next)=>{
    let sellers=await SellerModel.find({});
    if(sellers){
        res.json({success:true,data:sellers});
    }
    else
    res.json({success:false,msg:"no sellers have been found"});
})

module.exports=router
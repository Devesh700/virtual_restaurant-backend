const UserImage=require("../multer/UserImage");
const SellerImage=require("../multer/SellerImage")
const router=require("express").Router();
router.route("/user").post(UserImage);
router.route("/seller").post(SellerImage);
module.exports=router
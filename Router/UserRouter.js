const { RegisterUser, UpdateUser, loginUser } = require("../Authentication/UserAuthentication");

const router=require("express").Router();
router.route("/register").post(RegisterUser);
router.route("/login").post(loginUser);
router.route("/update").put(UpdateUser);

module.exports=router
const fs = require("fs");
const uploads = require("./config");
const path = require("path");
const { SellerModel } = require("../Database/DB");

const addImage = async (req, res, next) => {
    try {
        uploads.single('profile')(req, res, async function(err) {
            if (err) {
                return res.status(400).json({ success: false, error: err.message });
            }

            const imageUrl = `http://localhost:4000/uploads/images/${req.file?.filename}`;            
            console.log("this is sellers id:"+req.body?._id);
            let user=await SellerModel.findOne({_id:req.body?._id})
            console.log("user found"+user)
            if(user){
            user.profile = imageUrl;
            await user.save();
            console.log("this is the user:"+user)
            }

            // Send response to the client
            res.cookie("user-data",user).json({ success: true, msg: "Uploaded successfully", data:user });
        });
    } catch (error) {
        console.error("error occured"+error);
        res.status(500).json({ success: false, error: "Internal Server Error" });
    }
};

module.exports = addImage;

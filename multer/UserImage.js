const fs = require("fs");
const UserModel = require("../Database/models/User.model");
const uploads = require("./config");
const path = require("path");
const { userModel } = require("../Database/DB");

const addImage = async (req, res, next) => {
    try {
        uploads.single('profile')(req, res, async function(err) {
            if (err) {
                return res.status(400).json({ success: false, error: err.message });
            }

            const imageUrl = `http://localhost:4000/uploads/images/${req.file?.filename}`;            
            let user=await userModel.findOne({_id:req.body._id})
            if(user){
            user.profile = imageUrl;
            await user.save();
            }

            // Send response to the client
            res.cookie("user-data",user).json({ success: true, msg: "Uploaded successfully", data:user });
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, error: "Internal Server Error" });
    }
};

module.exports = addImage;

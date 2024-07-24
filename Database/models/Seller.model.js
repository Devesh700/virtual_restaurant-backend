const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt=require("jsonwebtoken");
const SellerSchema = new mongoose.Schema({
    email: {
        type: String,
        requird: true,
        unique: true
    },
    restaurantName: {
        type: String,
        requird: true,
    },
    aadharName: {
        type: String,
        requird: true,
    },
    aadharNumber: {
        type: String,
        required: true,
        min: 12,
        max: 12,
        unique: true
    },
    phone: {
        type: String,
        required: true,
        min: 10,
        max: 10,
        unique: true
    },
    password: {
        type: String,
        required: true,
        min: 8,
        max: 12
    },
      profile: {
        type: String,
        default:"http://localhost:4000/uploads/images/th.jpg"
    },
    products: {
        type: [],
        ref: 'product'
    },
    notifications:{
        type:[]
    },
    verified:{
        type:Boolean,
        default:false
    }

},
    {
        timestamps:true
    }
)


SellerSchema.pre("save", async function (next) {
    if (this.isModified("password"))
        this.password =await bcrypt.hash(this.password,10);
    next();
})

SellerSchema.methods.isPasswordCorrect = async function (password) {
    return await bcrypt.compare(password, this.password);
}

SellerSchema.methods.generateAccessToken = function () {
    let token=jwt.sign(
        {
        _id:this._id,
        email:this.email,

    },
    "custom_access_token",
    {
        expiresIn:"7d"
    }
    )
    return token
}
SellerSchema.methods.generateRefreshToken = function () {
    jwt.sign(
        {
        _id:this._id,
        email:this.email,

    },
    "custom_refresh_token",
    {
        expiresIn:"7d"
    }
    )
}

module.exports = mongoose.model("seller", SellerSchema);
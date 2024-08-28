const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt=require("jsonwebtoken");
const UserSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
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
    },
    orders: {
        type: [],
        ref: 'Order'
    },
    notifications:{
        type:[]
    }

},
    {
        timestamps:true
    }
)


UserSchema.pre("save", async function (next) {
    if (this.isModified("password"))
        this.password =await bcrypt.hash(this.password,10);
    next();
})

UserSchema.methods.isPasswordCorrect = async function (password) {
    return await bcrypt.compare(password, this.password);
}

UserSchema.methods.generateAccessToken = function () {
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
UserSchema.methods.generateRefreshToken = function () {
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

module.exports = mongoose.model("user", UserSchema);
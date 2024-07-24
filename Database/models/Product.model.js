const mongoose=require("mongoose");
const ProductSchema=new mongoose.Schema({
    productname:{
        type:String,
        required:true,
    },
    price:{
        type:Number,
        required:true,
    },
    category:{
        type:String,
        required:true
    },
    avaialable:{
        type:Boolean
    },
    quantity:{
        type:Number,
        required:true
    },
    image:{
        type:String
    },
    location:{
        type:String
    },
    seller:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"seller"
    }
},
{
    timestamps:true
}
)

ProductSchema.pre("save", async function (next) {
    if (this.isModified("quantity"))
        this.avaialable=this.quantity>0?true:false;
    next();
})
module.exports=mongoose.model("product",ProductSchema);
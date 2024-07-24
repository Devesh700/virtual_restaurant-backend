const { productModel } = require("../Database/DB");
const ProductModel = require("../Database/models/Product.model");
const { AddProduct, UpdateProduct, PopulateProducts }=require("../OrderHandler/Products")
const router=require("express").Router();

router.route("/addproduct").post(AddProduct);
router.get("/",async(req,res,next)=>{
    let product=await productModel.find({})
    if(product){
        res.json({success:true,data:product})
    }
})

router.post("/getproducts", async (req, res, next) => {
    let products = []
    let ids = req.body?._id;
    // Map each id to a promise returned by findOne
    let promises = ids.map(async (_id) => {
        let prod = await productModel.findOne({ _id: _id });
        return prod;
    });
    // Wait for all promises to resolve
    products = await Promise.all(promises);
    res.json({success:true,data:products})
});
// router.route("/updateproduct").post(UpdateProduct);
// router.route("/").get(PopulateProducts);

module.exports=router;
// const {productModel}=require("../Database/DB/index");
// const uploads = require("../multer/config");

// const AddProduct=async(req,res,next)=>{
//     try{
//     uploads.single('profile')(req, res, async function(err) {
//             if (err) {
//                 return res.status(400).json({ success: false, error: err.message });
//             }

//             const imageUrl = `http://localhost:4000/uploads/images/${req.file.filename}`;            
//             let product;
//     console.log(req.body)
//     try{
//         product=await productModel.create({
//             productname:req.body.productname,
//             price:req.body.price,
//             category:req.body.category,
//             quantity:req.body.quantity,
//             user:req.body.user._id
//         })
        
//         res.json({success:true,msg:"your product has been published",data:product})
//     }
//     catch(err){
//         res.json({success:false,msg:"unknown error occured try again",error:err})
//     }
//         })
//     }
//     catch(err){
//         res.json({success:false,msg:"error occured"})
//     }
// }



// const UpdateProduct=async (req,res,next)=>{
//     let product;
//     try{
//         product=await productModel.findOne({user:req.body.user._id,productname:req.body.productname})
//     }
//     catch(err){
//         res.json({success:false,msg:"product not found",error:err})
//     }
//     try{
//         product=await product.updateOne({
//             productname:req.body.productname,
//             price:req.body.price,
//             category:req.body.category,
//             quantity:req.body.quantity,
//         })
        
//         res.json({success:true,msg:"your product has been published",data:product})
//     }
//     catch(err){
//         res.json({success:false,msg:"unknown error occured try again",error:err})
//     }
// }


// const PopulateProducts=async(req,res,next)=>{
//     let product;
//     try{
//         product=await productModel.findOne({user:req.body.user._id,productname:req.body.productname})
//         console.log(product)
//     }
//     catch(err){
//         res.json({success:false,msg:"error finding the product",error:err})
//     }

//     try{
//         let user=await product.populate("user")
//         console.log(user)
//         res.json({success:true,msg:"successfull retreival",data:user})
//     }
//     catch(err){
//         res.json({success:false,msg:"unknown error occured while fetching",error:err})
//     }
// }
// module.exports={AddProduct,UpdateProduct,PopulateProducts}


const { productModel, SellerModel } = require("../Database/DB/index");
const uploads=require("../multer/config");
const AddProduct = async (req, res, next) => {
  try {
    uploads.single("productImage")(req, res, async function (err) {
      if (err) {
        return res.status(400).json({ success: false, error: err.message });
      }

      // File upload successful, now handle other form fields
      const image = `http://localhost:4000/uploads/images/${req.file.filename}`;
      const { productname, price, category, quantity, seller,location } = req.body;
      let user=await SellerModel.findOne({_id:seller});

      // Create new product using parsed form fields
      const product = await productModel.create({
        productname,
        price,
        category,
        quantity,
        image,
        location,
        seller
      });
      if(product){
        user.products=[...user.products,product._id]
        await user.save();
      }

      res.json({ success: true, msg: "Your product has been published", data: product });
    });
  } catch (err) {
    res.status(500).json({ success: false, msg: "Unknown error occurred, please try again", error: err });
  }
};

module.exports = { AddProduct };

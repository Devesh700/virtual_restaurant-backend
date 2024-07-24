const { userModel, orderModel } = require("../Database/DB");
const {PlaceOrder,ApproveOrder, CancelOrder, RemoveNotification}=require("../OrderHandler/Order");
const router=require("express").Router();

router.route("/placeorder").post(PlaceOrder);
router.route("/approval").post(ApproveOrder);
router.route("/cancelorder").post(CancelOrder);
router.route("/removenotification").post(RemoveNotification);

router.post('/',async(req,res,next)=>{
    // let user=userModel.findOne({_id:req.body.user?._id});
    let orderId=req.body?._id;
    let promises=orderId.map(async(_id)=>{
    let order=await orderModel.findOne({_id:_id})
    return order;
    })
    let orders=await Promise.all(promises);
    console.log(orders)
    res.json({success:true,data:orders});

})
// router.route("/updateproduct").post(UpdateProduct);

module.exports=router;
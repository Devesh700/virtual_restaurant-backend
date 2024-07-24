const { orderModel, productModel, userModel, SellerModel } = require("../Database/DB");
const OrderModel = require("../Database/models/Order.model");

const PlaceOrder = async (req, res, next) => {
    try {
        const product = await productModel.findOne({ _id: req.body.id.pid });
        const user = await userModel.findOne({ _id: req.body.id.uid });

        if (!product || !user) {
            return res.status(404).json({ success: false, msg: "Product or user not found." });
        }

        if (product.quantity < req.body.quantity) {
            return res.status(400).json({ success: false, msg: "Demanded quantity for this product is not available." });
        }

        const order = await orderModel.create({
            address: req.body.address,
            quantity: req.body.quantity,
            orderedby: req.body.id.uid,
            product: req.body.id.pid,
            productname:product.productname,
        });

        user.orders=[...user.orders,order._id];
        await user.save();
        let seller=await SellerModel.findOne({_id:req.body.id.sid})
        const notificationData={order:order,user:user,product:product}
        seller.notifications=[...seller.notifications,notificationData]
        await seller.save();
        await product.updateOne({
            quantity: product.quantity - req.body.quantity,
            available: (product.quantity - req.body.quantity) > 0
        });

        return res.status(200).json({ success: true, msg: "Your order has been placed successfully.", data: user });
    } catch (err) {;
        return res.status(500).json({ success: false, msg: "Unknown error occurred. Please try again later." });
    }
};


const ApproveOrder=async(req,res,next)=>{
    console.log(req.body);
    let user=await userModel.findOne({_id:req.body.user._id});
    let product=await productModel.findOne({_id:req.body.product._id});
    let order=await OrderModel.findOne({_id:req.body.order._id});
    let seller=await SellerModel.findOne({_id:req.body.product.seller})
    let notificationData={approval:req.body.approval,product:product,seller:seller,order:order}
    user.notifications=[...user.notifications,notificationData];
    await user.save();
    product.quantity=req.body.approval==="reject"?product.quantity+order.quantity:product.quantity;
    await product.save();
    order.approval=req.body.approval;
    order.status=req.body.approval==="approve"?"preparing":"cancelled by seller"
    await order.save();
    let sellersNotfication=seller.notifications.filter((msg)=>!msg.order._id===order._id)
    seller.notifications=sellersNotfication;
    await seller.save();
    res.json({success:true,data:seller})
}

const RemoveNotification=async(req,res,next)=>{
    let user=await userModel.findOne({_id:req.body.user});
    let usersNotfication=user.notifications?.filter((msg)=>!msg.order._id===req.body.order)
    user.notifications=usersNotfication;
    await user.save();
    res.json({success:true,data:user});
}

const CancelOrder=async(req,res,next)=>{
    console.log(req.body)
    let order=await orderModel.findOne({_id:req.body._id});
    let product=await productModel.findOne({_id:req.body.product});
    let user=await userModel.findOne({_id:req.body.orderedby});
    console.log(order);
    console.log(product);

    order.status="cancelled";
    await order.save();
    product.quantity=product.quantity+order.quantity;
    await product.save();
}

module.exports = {PlaceOrder,ApproveOrder,CancelOrder,RemoveNotification};

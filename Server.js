require("dotenv").config({ path: "./.env" });
const express = require("express");
const cookieSession = require("cookie-session");
const expressSession = require("express-session");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const { DB } = require("./Database/DB/index");
const UserRouter = require("./Router/UserRouter");
const SellerRoute = require("./Router/SellerRoute");
const ProductRoute = require("./Router/ProductRoute");
const OrderRoute = require("./Router/OrderRoute");
const ImageRoute = require("./Router/ImageRoute");

const router = express();

router.use(express.json());
router.use(cookieSession({
    secure: false,
    name: "session",
    keys: ["secret1", "secret2"],
    maxAge: 24 * 60 * 60 * 10000,
}));

router.use(cookieParser());
router.use(cors());
router.use('/uploads', express.static('uploads'));

router.use("/api/user", UserRouter);
router.use("/api/products", ProductRoute);
router.use("/api/orders", OrderRoute);
router.use("/api/seller", SellerRoute);
router.use('/api/images', ImageRoute);

const PORT = process.env.PORT || 4000; // Default to 4000 if PORT is not defined

router.listen(PORT, async () => {
    await DB();
    console.log(`Server is running on port ${PORT}`);
});

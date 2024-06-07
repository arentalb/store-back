import express from 'express';
import authRoutes from "./features/user/auth/authRoutes.js";
import userRoutes from "./features/user/userRoutes.js";
import categoryRoutes from "./features/category/categoryRoutes.js";
import productRoutes from "./features/product/productRoutes.js";
import cartRoutes from "./features/cart/cartRoutes.js";
import orderRoutes from "./features/order/orderRoutes.js";
import AppError from "./utils/AppError.js";

const router = express.Router();

router.use("/auth", authRoutes);
router.use("/user", userRoutes);
router.use("/category", categoryRoutes);
router.use("/product", productRoutes);
router.use("/cart", cartRoutes);
router.use("/order", orderRoutes);

router.all("*", (req, res, next) => {
    next(new AppError(`Cannot find ${req.originalUrl} on this server`, 404));
});

export default router;

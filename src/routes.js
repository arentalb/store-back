import express from 'express';
import authRoutes from "./features/user/auth/authRoutes.js";
import userRoutes from "./features/user/userRoutes.js";
import categoryRoutes from "./features/category/categoryRoutes.js";
import productRoutes from "./features/product/productRoutes.js";
import cartRoutes from "./features/cart/cartRoutes.js";
import orderRoutes from "./features/order/orderRoutes.js";
import AppError from "./utils/AppError.js";
import metricsRoutes from "./features/metrics/metricsRoutes.js";

const router = express.Router();

router.get("/status", (req, res) => {
    res.status(200).json({
        status: "success",
        message: "Server is running"
    });
});

router.use("/auth", authRoutes);
router.use("/users", userRoutes);
router.use("/category", categoryRoutes);
router.use("/products", productRoutes);
router.use("/carts", cartRoutes);
router.use("/orders", orderRoutes);
router.use("/metrics", metricsRoutes);

router.all("*", (req, res, next) => {
    next(new AppError(`Cannot find ${req.originalUrl} on this server`, 404));
});

export default router;

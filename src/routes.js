import express from 'express';
import userRoutes from "./features/user/userRoutes.js";
import categoryRoutes from "./features/category/categoryRoutes.js";
import productRoutes from "./features/product/productRoutes.js";
import cartRoutes from "./features/cart/cartRoutes.js";
import orderRoutes from "./features/order/orderRoutes.js";
import {GeneralError} from "./utils/errors.js";

const router = express.Router();

router.use("/user", userRoutes);
router.use("/category", categoryRoutes);
router.use("/product", productRoutes);
router.use("/cart", cartRoutes);
router.use("/order", orderRoutes);

router.all("*", (req, res, next) => {
    next(new GeneralError(`Cannot find ${req.originalUrl} on this server`, 404));
});

export default router;

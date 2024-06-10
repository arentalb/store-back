import {authenticate, authorizeTo, isVerified,} from "../../middlwares/authMiddleware.js";
import express from "express";
import orderController from "./orderController.js";
import checkoutController from "./checkoutController.js";

const router = express.Router();

router.use(isVerified)

//payment
router.post("/checkout-session", authenticate, authorizeTo("User"), isVerified,
    checkoutController.getCheckoutSession);
router.get("/success", authenticate, authorizeTo("User"), isVerified,
    checkoutController.updateOrderToPaid);

//admin
router.get("/all", authenticate, authorizeTo("Admin", "SuperAdmin"), isVerified,
    orderController.getAllOrders);
router.get("/detail/:id", authenticate, authorizeTo("Admin", "SuperAdmin"), isVerified,
    orderController.getOrderById);
router.put("/:id", authenticate, authorizeTo("Admin", "SuperAdmin"), isVerified,
    orderController.updateOrderStatus,);

//user
router.get("/", authenticate, authorizeTo("User"), isVerified,
    orderController.getUserOrders);
router.get("/:id", authenticate, authorizeTo("User"), isVerified,
    orderController.getUserOrderDetail);
router.post("/", authenticate, authorizeTo("User"), isVerified,
    orderController.createOrderFromCart);

export default router;

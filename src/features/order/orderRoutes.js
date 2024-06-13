import {authenticate, authorizeTo,} from "../../middlwares/authMiddleware.js";
import express from "express";
import orderController from "./orderController.js";
import checkoutController from "./checkoutController.js";

const router = express.Router();


//payment
router.post("/checkout-session", authenticate, authorizeTo("User"),
    checkoutController.getCheckoutSession);
router.get("/success", authenticate, authorizeTo("User"),
    checkoutController.updateOrderToPaid);

//admin
router.get("/all", authenticate, authorizeTo("Admin", "SuperAdmin"),
    orderController.getAllOrders);
router.get("/detail/:id", authenticate, authorizeTo("Admin", "SuperAdmin"),
    orderController.getOrderById);
router.put("/:id", authenticate, authorizeTo("Admin", "SuperAdmin"),
    orderController.updateOrderStatus,);

//user
router.get("/", authenticate, authorizeTo("User"),
    orderController.getUserOrders);
router.get("/:id", authenticate, authorizeTo("User"),
    orderController.getUserOrderDetail);
router.post("/", authenticate, authorizeTo("User"),
    orderController.createOrderFromCart);

export default router;

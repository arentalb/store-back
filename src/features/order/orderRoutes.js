import {
  authenticate,
  authorizeAdmin,
} from "../../middlwares/authMiddleware.js";
import express from "express";
import orderController from "./orderController.js";

const router = express.Router();

//everyone

//user
router.get("/myorders", authenticate, orderController.getUserOrders);
router.get("/myorder/:id", authenticate, orderController.getUserOrderDetail);

router.post("/myorders/new", authenticate, orderController.createOrderFromCart);

//admin
router.get("/all", authenticate, authorizeAdmin, orderController.getAllOrders);
router.get("/:id", authenticate, authorizeAdmin, orderController.getOrderById);

router.put(
  "/:id",
  authenticate,
  authorizeAdmin,
  orderController.updateOrderStatus,
);

export default router;

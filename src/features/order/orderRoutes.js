import {
  authenticate,
  authorizeAdmin,
} from "../../middlwares/authMiddleware.js";
import express from "express";
import orderController from "./orderController.js";

const router = express.Router();

//everyone

//user
router.post("/", authenticate, orderController.createOrderFromCart);

//admin
router.get("/", authenticate, authorizeAdmin, orderController.getAllOrders);
router.get("/:id", authenticate, authorizeAdmin, orderController.getOrderById);
router.put(
  "/:id",
  authenticate,
  authorizeAdmin,
  orderController.updateOrderStatus,
);

export default router;

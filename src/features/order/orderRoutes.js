import { authenticate } from "../../middlwares/authMiddleware.js";
import express from "express";
import orderController from "./orderController.js";

const router = express.Router();

//everyone

//user

//admin
router.post("/from-cart", authenticate, orderController.createOrderFromCart);
//admin

export default router;

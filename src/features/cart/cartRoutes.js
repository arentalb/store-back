import { authenticate } from "../../middlwares/authMiddleware.js";
import cartController from "./cartController.js";
import express from "express";

const router = express.Router();

//everyone

//user
router.get("/", authenticate, cartController.getCart);
router.post("/", authenticate, cartController.addToCart);
router.put("/", authenticate, cartController.updateCartItem);
router.delete("/", authenticate, cartController.removeCartItem);
//admin

export default router;

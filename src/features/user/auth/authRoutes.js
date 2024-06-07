import express from "express";
import authController from "./authController.js";

const router = express.Router();


//everyone
router.post("/register", authController.register);
router.post("/login", authController.login);
router.post("/logout", authController.logout);

export default router;

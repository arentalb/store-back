import express from "express";
import userController from "../controller/userController.js";

const router = express.Router();

router.post("/register", userController.registerUser);

export default router;

import express from "express";
import userController from "../controller/userController.js";
import {authenticate, authorizeAdmin} from "../middlwares/authMiddleware.js";

const router = express.Router();

router.post("/register", userController.registerUser);
router.post("/login", userController.loginUser);
router.post("/logout", userController.logoutUser);

router.get("/all", authenticate, authorizeAdmin, userController.getAllUser);
router.get("/profile", authenticate, userController.getCurrentUserProfile);
router.put("/profile", authenticate, userController.updateCurrentUserProfile);

export default router;

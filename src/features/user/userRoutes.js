import express from "express";
import userController from "./userController.js";
import {
  authenticate,
  authorizeAdmin,
} from "../../middlwares/authMiddleware.js";

const router = express.Router();

//everyone
router.post("/register", userController.registerUser);
router.post("/login", userController.loginUser);
router.post("/logout", userController.logoutUser);

//user
router.get("/profile", authenticate, userController.getProfile);
router.put("/profile", authenticate, userController.updateProfile);

//admin
router.get("/all", authenticate, authorizeAdmin, userController.getAllUser);
router.get("/:id", authenticate, authorizeAdmin, userController.getUserById);
router.put("/:id", authenticate, authorizeAdmin, userController.updateUserById);
router.delete(
  "/:id",
  authenticate,
  authorizeAdmin,
  userController.deleteUserById,
);

export default router;

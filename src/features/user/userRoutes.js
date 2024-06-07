import express from "express";
import userController from "./userController.js";
import {authenticate, authorizeAdmin,} from "../../middlwares/authMiddleware.js";

const router = express.Router();


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

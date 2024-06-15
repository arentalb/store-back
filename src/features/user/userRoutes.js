import express from "express";
import userController from "./userController.js";
import {authenticate, authorizeTo, isVerified} from "../../middlwares/authMiddleware.js";

const router = express.Router();

// User Routes
router.get('/me', authenticate, userController.getProfile);
router.put('/me', authenticate, userController.updateProfile);
router.put('/change-password', authenticate, userController.changePassword);

// Admin Routes
router.get('/admin', authenticate, authorizeTo('Admin', 'SuperAdmin'), isVerified, userController.getAllUsers);
router.get('/admin/:id', authenticate, authorizeTo('Admin', 'SuperAdmin'), isVerified, userController.getUserById);

// Super Admin Routes
router.put('/admin/:id', authenticate, authorizeTo('SuperAdmin'), isVerified, userController.updateUser);

export default router;

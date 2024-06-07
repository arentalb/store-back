import express from "express";
import userController from "./userController.js";
import {authenticate, authorizeTo} from "../../middlwares/authMiddleware.js";

const router = express.Router();

// User Routes
router.get('/me', authenticate, userController.getProfile);
router.put('/me', authenticate, userController.updateProfile);
router.put('/change-password', authenticate, userController.changePassword);

// Admin Routes
router.get('/admin', authenticate, authorizeTo('admin', 'SuperAdmin'), userController.getAllUsers);
router.get('/admin/:id', authenticate, authorizeTo('admin', 'SuperAdmin'), userController.getUserById);

// Super Admin Routes
router.put('/admin/:id', authenticate, authorizeTo('SuperAdmin'), userController.updateUser);

export default router;

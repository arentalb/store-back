import express from "express";
import userController from "./userController.js";
import {authenticate, authorizeTo, isVerified} from "../../middlwares/authMiddleware.js";

const router = express.Router();

router.get('/me', authenticate, userController.getProfile);
router.put('/me', authenticate, userController.updateProfile);
router.put('/change-password', authenticate, userController.changePassword);

router.get('/admin', authenticate, authorizeTo('Admin', 'SuperAdmin'), isVerified, userController.getAllUsers);
router.get('/admin/:id', authenticate, authorizeTo('Admin', 'SuperAdmin'), isVerified, userController.getUserById);

router.put('/admin/:id', authenticate, authorizeTo('SuperAdmin'), isVerified, userController.updateUser);

export default router;

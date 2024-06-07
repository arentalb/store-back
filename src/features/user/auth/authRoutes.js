import express from "express";
import authController from "./authController.js";


const router = express.Router();

router.get("/refresh", authController.refresh);
router.post("/register", authController.register);
router.post("/login", authController.login);
router.post("/logout", authController.logout);

router.post('/verify-email/request', authController.emailVerificationRequest);
router.get('/verify-email/confirm', authController.emailVerificationConfirm);

router.post('/password-reset/request', authController.resetPasswordRequest);
router.post('/password-reset/confirm', authController.resetPasswordConfirm);

export default router;

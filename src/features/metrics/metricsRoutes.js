import {authenticate, authorizeTo, isVerified,} from "../../middlwares/authMiddleware.js";
import express from "express";
import metricsController from "./metricsController.js";

const router = express.Router();


router.get(
    "/",
    authenticate,
    authorizeTo('Admin', 'SuperAdmin'), isVerified,
    metricsController.getMetrics,
);


export default router;

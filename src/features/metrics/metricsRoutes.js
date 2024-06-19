import {authenticate,} from "../../middlwares/authMiddleware.js";
import express from "express";
import metricsController from "./metricsController.js";

const router = express.Router();


//admin
router.get(
    "/",
    authenticate,
    // authorizeTo('Admin', 'SuperAdmin'), isVerified,
    metricsController.getMetrics,
);


export default router;

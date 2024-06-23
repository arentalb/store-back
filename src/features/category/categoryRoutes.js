import {authenticate, authorizeTo, isVerified,} from "../../middlwares/authMiddleware.js";
import express from "express";
import categoryController from "./categoryController.js";

const router = express.Router();


router.get("/", categoryController.getCategories);

router.post(
    "/",
    authenticate,
    authorizeTo('Admin', 'SuperAdmin'), isVerified,
    categoryController.createCategory,
);
router.put(
    "/:id",
    authenticate,
    authorizeTo('Admin', 'SuperAdmin'), isVerified,
    categoryController.updateCategory,
);
router.delete(
    "/:id",
    authenticate,
    authorizeTo('Admin', 'SuperAdmin'), isVerified,
    categoryController.deleteCategory,
);

export default router;

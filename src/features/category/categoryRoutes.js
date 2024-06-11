import {authenticate, authorizeTo,} from "../../middlwares/authMiddleware.js";
import express from "express";
import categoryController from "./categoryController.js";

const router = express.Router();

//everyone

//user
router.get("/", categoryController.getCategories);

//admin
router.post(
    "/",
    authenticate,
    authorizeTo('Admin', 'SuperAdmin'),
    categoryController.createCategory,
);
router.put(
    "/:id",
    authenticate,
    authorizeTo('Admin', 'SuperAdmin'),
    categoryController.updateCategory,
);
router.delete(
    "/:id",
    authenticate,
    authorizeTo('Admin', 'SuperAdmin'),
    categoryController.deleteCategory,
);

export default router;

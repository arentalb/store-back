import express from "express";

import productController from "./productController.js";
import {authenticate, authorizeTo} from "../../middlwares/authMiddleware.js";
import upload from "../../utils/fileupload.js";
import reviewRoutes from "../review/reviewRoutes.js";

const router = express.Router();

// Public routes
router.get("/", productController.getAllProducts); // Get all products
router.get("/new", productController.getNewProducts); // Get new products
router.get("/:id", productController.getProductById); // Get product by ID

// Routes accessible to authenticated users
router.get("/search/:query", authenticate, productController.searchProducts); // Search products by query

// Routes accessible to admins only
router.post(
    "/",
    authenticate,
    authorizeTo("Admin", "SuperAdmin"),
    upload.fields([{
        name: 'coverImage', maxCount: 1
    }, {
        name: 'images', maxCount: 5
    }]),
    productController.createProduct
);
router.put(
    "/:id",
    authenticate,
    authorizeTo("Admin", "SuperAdmin"),
    upload.fields([{
        name: 'coverImage', maxCount: 1
    }, {
        name: 'images', maxCount: 5
    }]),
    productController.updateProduct
);
router.delete(
    "/:id",
    authenticate,
    authorizeTo("Admin", "SuperAdmin"),
    productController.deleteProduct
);

router.use('/:id/reviews', reviewRoutes);

export default router;

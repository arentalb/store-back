import express from "express";

import productController from "./productController.js";
import {authenticate, authorizeTo, isVerified} from "../../middlwares/authMiddleware.js";
import upload from "../../utils/fileupload.js";
import reviewRoutes from "../review/reviewRoutes.js";

const router = express.Router();

router.get("/", productController.getAllProducts);
router.get("/new", productController.getNewProducts);
router.get("/:id", authenticate, isVerified, productController.getProductById);

router.get("/search/:query", authenticate, productController.searchProducts);

router.post(
    "/",
    authenticate,
    authorizeTo("Admin", "SuperAdmin"),
    isVerified,
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
    isVerified,
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
    authorizeTo("Admin", "SuperAdmin"), isVerified,
    productController.deleteProduct
);

router.use('/:id/reviews', reviewRoutes);

export default router;

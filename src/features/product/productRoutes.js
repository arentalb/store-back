import express from "express";
import {
  authenticate,
  authorizeAdmin,
} from "../../middlwares/authMiddleware.js";
import productController from "./productController.js";
import upload from "../../utils/fileupload.js";

const router = express.Router();

//everyone

//user
router.get("/", authenticate, productController.getAllProducts);
router.get("/new", authenticate, productController.getNewProducts);
router.get("/:id", authenticate, productController.getProductById);

//admin
router.post(
  "/",
  authenticate,
  authorizeAdmin,
  upload.single("image"),
  productController.createProduct,
);
router.put(
  "/:id",
  authenticate,
  authorizeAdmin,
  upload.single("image"),
  productController.updateProduct,
);
router.delete(
  "/:id",
  authenticate,
  authorizeAdmin,
  productController.deleteProduct,
);

export default router;

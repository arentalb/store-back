import { authenticate, authorizeAdmin } from "../middlwares/authMiddleware.js";
import express from "express";
import categoryController from "../controller/categoryController.js";

const router = express.Router();

//everyone

//user
router.get("/", authenticate,categoryController.getCategories);

//admin
router.post("/", authenticate, authorizeAdmin, categoryController.createCategory);
router.put("/:id", authenticate, authorizeAdmin, categoryController.updateCategory);
 router.delete("/:id", authenticate, authorizeAdmin,categoryController.deleteCategory);


export default router;

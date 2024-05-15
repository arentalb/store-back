import expressAsyncHandler from "express-async-handler";
import { sendFailure, sendSuccess } from "../utils/resposeSender.js";
import categoryService from "../service/categoryService.js";

const getCategories = expressAsyncHandler(async (req, res) => {
  const categories = await categoryService.getCategories();
  if (categories) {
    sendSuccess(res, categories, 200);
  }
});
const createCategory = expressAsyncHandler(async (req, res) => {
  const { name } = req.body;
  if (!name) {
    sendFailure(res, "Please provide category name ", 400);
    return;
  }
  const existingCategory = await categoryService.getCategory(name);
  console.log(existingCategory);
  if (existingCategory) {
    console.log("failed");
    sendFailure(res, "Category already exists", 401);
  } else {
    console.log("else");
    const category = await categoryService.createCategory(name);
    const responseData = { _id: category._id, name: category.name };
    sendSuccess(res, responseData, 201);
  }
});

const updateCategory = expressAsyncHandler(async (req, res) => {
  const { name } = req.body;
  if (!name) {
    sendFailure(res, "Provide category name for update");
  }
  const { id } = req.params;
  if (!id) {
    sendFailure(res, "Provide category id for update");
  }
  const updatedCategory = await categoryService.updateCategory(id, name);
  const responseData = { _id: updatedCategory._id, name: updatedCategory.name };

  sendSuccess(res, responseData, 201);
});

const deleteCategory = expressAsyncHandler(async (req, res) => {
  const { id } = req.params;
  if (!id) {
    sendFailure(res, "Provide category id to be deleted ", 401);
    return;
  }
  const category = await categoryService.getCategoryById(id);
  if (!category) {
    sendFailure(res, "Could not find category to be deleted ", 401);
    return;
  }
  await categoryService.deleteCategory(id);
  sendSuccess(res, "Category deleted", 201);
});

export default {
  getCategories,
  createCategory,
  updateCategory,
  deleteCategory,
};

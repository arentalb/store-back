import {sendSuccess} from "../../utils/resposeSender.js";
import Category from "./Category.js";
import catchAsync from "../../utils/catchAsync.js";
import AppError from "../../utils/AppError.js";

const getCategories = catchAsync(async (req, res) => {
    const categories = await Category.find().select("_id name ");
    sendSuccess(res, categories, 200);

});
const createCategory = catchAsync(async (req, res) => {
    const {name} = req.body;
    if (!name) {
        throw new AppError("Please provide category name ", 400)
    }
    const existingCategory = await Category.findOne({name: name});
    if (existingCategory) {
        throw new AppError("Category already exists", 400)
    }
    const category = await Category.create({name});
    const responseData = {id: category._id, name: category.name};
    sendSuccess(res, responseData, 201);
});

const updateCategory = catchAsync(async (req, res) => {
    const {name} = req.body;
    if (!name) {
        throw new AppError("Provide category name for update", 400)
    }
    const {id} = req.params;
    if (!id) {
        throw new AppError("Provide category id for update", 400)
    }
    await Category.updateOne({_id: id}, {name: name});
    const updatedCategory = await Category.findOne({_id: id});
    const responseData = {_id: updatedCategory._id, name: updatedCategory.name};

    sendSuccess(res, responseData, 201);
});

const deleteCategory = catchAsync(async (req, res) => {
    const {id} = req.params;
    if (!id) {
        throw new AppError("Provide category id to be deleted ", 400)
    }
    const category = await Category.findById(id);
    if (!category) {
        throw new AppError("Could not find category to be deleted ", 400)
    }
    await Category.deleteOne({_id: id})
    sendSuccess(res, "Category deleted", 201);
});

export default {
    getCategories,
    createCategory,
    updateCategory,
    deleteCategory,
};

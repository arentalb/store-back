import categoryModel from "../models/categoryModel.js";

async function getCategoryById(id) {
    try {
        return await categoryModel.findById(id);
    } catch (error) {
        throw new Error("Error fetching all categories");
    }
}


async function getCategory(name) {
    try {
        return await categoryModel.findOne({name:name});
    } catch (error) {
        throw new Error("Error fetching all categories");
    }
}

async function getCategories() {
    try {
        return await categoryModel.find().select("_id name ");
    } catch (error) {
        throw new Error("Error fetching all categories");
    }
}

async function createCategory(name) {
    try {
        const a = await categoryModel.create({name});
        console.log(a)
        return a;
    } catch (error) {
        console.log(error)
        throw new Error("Error creating category");
    }
}

async function updateCategory(id , name ) {
    try {
        await categoryModel.updateOne({ _id: id }, { name: name });
        return  await categoryModel.findOne({ _id: id });

    } catch (error) {
        throw new Error("Error updating category");
    }
}

async function deleteCategory(id) {
    try {
        return await categoryModel.deleteOne({ _id: id });
    } catch (error) {
        throw new Error("Error deleting category");
    }
}

export default {
    getCategory,
    getCategories,
    createCategory,
    updateCategory,
    deleteCategory,
    getCategoryById
};

import {sendSuccess,} from "../../utils/resposeSender.js";
import Product from "./Product.js";
import catchAsync from "../../utils/catchAsync.js";
import AppError from "../../utils/AppError.js";
import {deleteImage} from "../../utils/fileupload.js";

const getAllProducts = catchAsync(async (req, res) => {
    const allProducts = await Product.find()
        .populate("category", "name _id") // Populate the 'category' field with 'name' and '_id'
        .sort({createdAt: -1});
    sendSuccess(res, allProducts, 200);
})
const getProductById = catchAsync(async (req, res) => {

    const productId = req.params.id;
    const allProducts = await Product.findById(productId).populate({
        path: 'reviews',
        select: 'rating comment user createdAt',
        populate: {
            path: 'user',
            select: 'username'
        }
    });
    sendSuccess(res, allProducts, 201);

});
const getNewProducts = catchAsync(async (req, res) => {
    const newProducts = await Product.find().sort({createdAt: -1}).limit(4);
    sendSuccess(res, newProducts, 201);

});
const searchProducts = catchAsync(async (req, res) => {

    sendSuccess(res, "searchProducts", 201);


});

const createProduct = catchAsync(async (req, res) => {
    const {name, description, category, tags, stock, price, availableStock} = req.body;

    // Access uploaded files and handle potential errors
    const coverImage = req.files.coverImage ? req.files.coverImage[0] : null;
    const otherImages = req.files.images ? req.files.images.map(file => file.path) : [];

    // Ensure coverImage is provided
    if (!coverImage) {
        throw new AppError("Cover image is required.", 400);
    }

    const newProduct = new Product({
        name,
        description,
        category,
        tags,
        stock,
        price,
        availableStock,
        coverImage: coverImage.path,
        images: otherImages,
    });

    const savedProduct = await newProduct.save();
    sendSuccess(res, savedProduct, 201);
});

const updateProduct = catchAsync(async (req, res) => {
    const {id} = req.params;
    const {name, description, category, tags, stock, price, deletedImages, availableStock} = req.body;


    // Access uploaded files and handle potential errors
    const coverImage = req.files?.coverImage ? req.files.coverImage[0] : null;
    const newImages = req.files?.images ? req.files.images.map((file) => file.path) : [];


    // Find the product to update
    const product = await Product.findById(id);
    if (!product) {
        throw new AppError("Product not found.", 404);
    }

    // Update product fields
    product.name = name || product.name;
    product.description = description || product.description;
    product.category = category || product.category;
    product.tags = tags || product.tags;
    product.stock = stock || product.stock;
    product.price = price || product.price;
    product.availableStock = availableStock || product.availableStock;
    // Update cover image if provided
    if (coverImage) {
        // Delete the old cover image from the server if it exists
        if (product.coverImage) {
            deleteImage(product.coverImage)
        }
        product.coverImage = coverImage.path;
    }

    // Handle deleted images
    if (deletedImages) {

        const imagesToDelete = Array.isArray(deletedImages) ? deletedImages : [deletedImages];
        imagesToDelete.forEach((imgPath) => {
            // Remove the image from the product's images array
            const imgIndex = product.images.indexOf(imgPath);
            if (imgIndex > -1) {
                product.images.splice(imgIndex, 1);
                // Delete the image from the server
                deleteImage(imgPath)
            }
        });
    }


    // Add new images if provided
    if (newImages.length > 0) {
        product.images.push(...newImages);
    }

    // Save the updated product
    const updatedProduct = await product.save();
    sendSuccess(res, updatedProduct, 200);
});

const deleteProduct = catchAsync(async (req, res) => {

    const foundedProduct = await Product.findById(req.params.id)
    deleteImage(foundedProduct.coverImage)
    foundedProduct.images.forEach((imgPath) => {
        deleteImage(imgPath)
    });
    await Product.deleteOne({_id: req.params.id})
    sendSuccess(res, "Product deleted", 201);


});


export default {
    getAllProducts,
    getProductById,
    getNewProducts,
    createProduct,
    updateProduct,
    deleteProduct,
    searchProducts,

};

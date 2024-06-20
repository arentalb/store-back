import {sendSuccess} from "../../utils/resposeSender.js";
import Product from "./Product.js";
import catchAsync from "../../utils/catchAsync.js";
import AppError from "../../utils/AppError.js";
import {deleteImage} from "../../utils/fileupload.js";
import Review from "../review/Review.js";

const getAllProducts = catchAsync(async (req, res) => {
    const allProducts = await Product.find()
        .populate("category", "name _id")
        .sort({createdAt: -1});
    sendSuccess(res, allProducts, 200);
});

const getProductById = catchAsync(async (req, res) => {
    const productId = req.params.id;

    const product = await Product.findById(productId).populate({
        path: 'reviews',
        select: 'rating comment user createdAt',
        populate: {
            path: 'user',
            select: 'username'
        }
    }).populate("category");

    if (!product) {
        throw new AppError('Product not found', 404);
    }

    const reviews = await Review.find({product: productId});
    const totalRating = reviews.reduce((acc, review) => acc + review.rating, 0);
    const averageRating = (totalRating / reviews.length) || 0;
    const formattedAverageRating = averageRating.toFixed(1);

    const productJson = product.toJSON();
    productJson.averageRating = parseFloat(formattedAverageRating);

    sendSuccess(res, productJson, 200);
});

const getNewProducts = catchAsync(async (req, res) => {
    const newProducts = await Product.find().sort({createdAt: -1}).limit(4);
    sendSuccess(res, newProducts, 200);
});

const searchProducts = catchAsync(async (req, res) => {
    sendSuccess(res, "searchProducts", 200);
});

const createProduct = catchAsync(async (req, res) => {
    const {name, description, category, tags, stock, price, availableStock} = req.body;

    const coverImage = req.files.coverImage ? req.files.coverImage[0] : null;
    const otherImages = req.files.images ? req.files.images.map(file => `/${file.path}`) : [];

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
        coverImage: `/${coverImage.path}`,
        images: otherImages,
    });

    const savedProduct = await newProduct.save();
    sendSuccess(res, savedProduct, 201);
});

const updateProduct = catchAsync(async (req, res) => {
    const {id} = req.params;
    const {name, description, category, tags, stock, price, deletedImages, availableStock} = req.body;

    const coverImage = req.files?.coverImage ? req.files.coverImage[0] : null;
    const newImages = req.files?.images ? req.files.images.map((file) => file.path) : [];

    const product = await Product.findById(id);
    if (!product) {
        throw new AppError("Product not found.", 404);
    }

    product.name = name || product.name;
    product.description = description || product.description;
    product.category = category || product.category;
    product.tags = tags || product.tags;
    product.stock = stock || product.stock;
    product.price = price || product.price;
    product.availableStock = availableStock || product.availableStock;

    if (coverImage) {
        if (product.coverImage) {
            deleteImage(product.coverImage);
        }
        product.coverImage = `/${coverImage.path}`;
    }

    if (deletedImages) {
        const imagesToDelete = Array.isArray(deletedImages) ? deletedImages : [deletedImages];
        imagesToDelete.forEach((imgPath) => {
            const imgIndex = product.images.indexOf(imgPath);
            if (imgIndex > -1) {
                product.images.splice(imgIndex, 1);
                deleteImage(imgPath);
            }
        });
    }

    if (newImages.length > 0) {
        const updatedImages = newImages.map((img) => `/${img}`);
        product.images.push(...updatedImages);
    }

    const updatedProduct = await product.save();
    sendSuccess(res, updatedProduct, 200);
});

const deleteProduct = catchAsync(async (req, res) => {
    const foundedProduct = await Product.findById(req.params.id);
    if (foundedProduct) {
        deleteImage(foundedProduct.coverImage);
        foundedProduct.images.forEach((imgPath) => {
            deleteImage(imgPath);
        });
        await Product.deleteOne({_id: req.params.id});
        sendSuccess(res, "Product deleted", 200);
    } else {
        throw new AppError("Product not found", 404);
    }
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

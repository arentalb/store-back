import {sendSuccess} from "../../utils/resposeSender.js";
import catchAsync from "../../utils/catchAsync.js";
import Product from "../product/Product.js";
import User from "../user/User.js";
import AppError from "../../utils/AppError.js";
import Review from "./Review.js";

// Get all reviews for a specific product
// URL: GET /hose/products/:id/reviews
const getAllReviews = catchAsync(async (req, res) => {
    const product = await Product.findById(req.params.id);

    if (!product) {
        throw new AppError("Invalid product ID", 404);
    }
    const reviews = await Review.find({product: product._id});

    sendSuccess(res, reviews, 200);
});

// Get a specific review for a specific product
// URL: GET /hose/products/:id/reviews/:reviewId
const getReview = catchAsync(async (req, res) => {
    const product = await Product.findById(req.params.id);
    const {reviewId} = req.params;

    if (!product) {
        throw new AppError("Invalid product ID", 404);
    }
    const review = await Review.findOne({product: product._id, _id: reviewId});

    if (!review) {
        throw new AppError("Review not found", 404);
    }

    sendSuccess(res, review, 200);
});

// Add a new review to a specific product
// URL: POST /hose/products/:id/reviews
const addReview = catchAsync(async (req, res) => {
    const {rating, comment} = req.body;

    const product = await Product.findById(req.params.id);
    const user = await User.findById(req.user._id);

    if (!product) {
        throw new AppError("Invalid product ID", 404);
    }
    if (!user) {
        throw new AppError("Invalid user ID", 404);
    }

    const existingReview = await Review.findOne({product: product._id, user: user._id});
    if (existingReview) {
        throw new AppError("You have already reviewed this product", 400);
    }

    const review = await Review.create({
        product: product._id,
        user: user._id,
        rating,
        comment
    });

    sendSuccess(res, review, 201);
});

// Check if a user has already reviewed a specific product
// URL: GET /hose/products/:id/reviewed
const hasReviewed = catchAsync(async (req, res) => {
    const product = await Product.findById(req.params.id);
    const user = await User.findById(req.user._id);

    if (!product) {
        throw new AppError("Invalid product ID", 404);
    }
    if (!user) {
        throw new AppError("Invalid user ID", 404);
    }

    const existingReview = await Review.findOne({product: product._id, user: user._id});
    const reviewed = !!existingReview;

    sendSuccess(res, {reviewed}, 200);
});

// Update a specific review for a specific product
// URL: PUT /hose/products/:id/reviews/:reviewId
const updateReview = catchAsync(async (req, res) => {
    const {rating, comment} = req.body;

    const product = await Product.findById(req.params.id);
    const review = await Review.findById(req.params.reviewId);

    if (!product) {
        throw new AppError("Invalid product ID", 404);
    }
    if (!review) {
        throw new AppError("Invalid review ID", 404);
    }

    review.rating = rating;
    review.comment = comment;

    const updatedReview = await review.save();
    sendSuccess(res, updatedReview, 200);
});

// Delete a specific review for a specific product
// URL: DELETE /hose/products/:id/reviews/:reviewId
const deleteReview = catchAsync(async (req, res) => {
    const product = await Product.findById(req.params.id);
    const review = await Review.findById(req.params.reviewId);

    if (!product) {
        throw new AppError("Invalid product ID", 404);
    }
    if (!review) {
        throw new AppError("Invalid review ID", 404);
    }

    await Review.deleteOne({_id: review._id});
    sendSuccess(res, "Review deleted", 200);
});

export default {
    getAllReviews,
    getReview,
    addReview,
    updateReview,
    deleteReview,
    hasReviewed
};

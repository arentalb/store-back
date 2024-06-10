import express from "express";
import {authenticate, authorizeTo, isVerified} from "../../middlwares/authMiddleware.js";
import reviewController from "./reviewController.js";

const router = express.Router({mergeParams: true});

router.use(isVerified)
// Get all reviews for a specific product
// URL: GET /hose/product/:id/reviews
router.get(
    '/',
    authenticate,
    reviewController.getAllReviews
);

// Get a specific review for a specific product
// URL: GET /hose/product/:id/reviews/:reviewId
router.get(
    '/:reviewId',
    authenticate,
    reviewController.getReview
);

// Add a new review to a specific product
// URL: POST /hose/product/:id/reviews
router.post(
    '/',
    authenticate,
    reviewController.addReview
);

// Update a specific review for a specific product
// URL: PUT /hose/product/:id/reviews/:reviewId
router.put(
    '/:reviewId',
    authenticate,
    authorizeTo('Admin', 'SuperAdmin', 'User'),
    reviewController.updateReview
);

// Delete a specific review for a specific product
// URL: DELETE /hose/product/:id/reviews/:reviewId
router.delete(
    '/:reviewId',
    authenticate,
    authorizeTo('Admin', 'SuperAdmin'),
    reviewController.deleteReview
);

export default router;

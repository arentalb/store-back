import express from "express";
import {authenticate, authorizeTo, isVerified} from "../../middlwares/authMiddleware.js";
import reviewController from "./reviewController.js";

const router = express.Router({mergeParams: true});


// Get all reviews for a specific product
// URL: GET /hose/product/:id/reviews
router.get(
    '/',
    authenticate, isVerified,
    reviewController.getAllReviews
);

router.get(
    '/reviewed',
    authenticate, isVerified,
    reviewController.hasReviewed
);
// Get a specific review for a specific product
// URL: GET /hose/product/:id/reviews/:reviewId
router.get(
    '/:reviewId',
    authenticate, isVerified,
    reviewController.getReview
);

// Add a new review to a specific product
// URL: POST /hose/product/:id/reviews
router.post(
    '/',
    authenticate, isVerified,
    reviewController.addReview
);

// Update a specific review for a specific product
// URL: PUT /hose/product/:id/reviews/:reviewId
router.put(
    '/:reviewId',
    authenticate,
    authorizeTo('Admin', 'SuperAdmin', 'User'), isVerified,
    reviewController.updateReview
);

// Delete a specific review for a specific product
// URL: DELETE /hose/product/:id/reviews/:reviewId
router.delete(
    '/:reviewId',
    authenticate,
    authorizeTo('Admin', 'SuperAdmin'), isVerified,
    reviewController.deleteReview
);

export default router;

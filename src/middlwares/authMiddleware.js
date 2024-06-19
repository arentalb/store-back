import jwt from "jsonwebtoken";
import User from "../features/user/User.js";
import catchAsync from "../utils/catchAsync.js";
import AppError from "../utils/AppError.js";

// Middleware to protect routes
export const authenticate = catchAsync(async (req, res, next) => {
    let token = "";

    // Check if the authorization header exists and starts with "Bearer "
    if (req.headers.authorization && req.headers.authorization.startsWith("Bearer ")) {
        // Extract the token from the authorization header
        token = req.headers.authorization.split(" ")[1];
    }

    // If no token in the header, check the cookies
    if (!token && req.cookies.accessToken) {
        token = req.cookies.accessToken;
    }

    // If no token is provided in both header and cookies, throw an error
    if (!token) {
        throw new AppError("You are not logged in, please log in first!", 401);
    }

    // Verify the token using the JWT secret
    const decoded = await jwt.verify(token, process.env.JWT_SECRET);

    // Check if the user still exists
    const freshUser = await User.findById(decoded.id);
    if (!freshUser) {
        throw new AppError("The token owner no longer exists", 401);
    }

    // // Check if the user changed their password after the token was issued
    // if (await freshUser.changedPasswordAfter(decoded.iat)) {
    //     throw new AppError("User recently changed password", 401);
    // }

    // Attach the user to the request object
    req.user = freshUser;
    next(); // Proceed to the next middleware or route handler
});

// Middleware to restrict access to specific roles
export const authorizeTo = (...roles) => {
    // roles is an array of allowed roles, e.g., ["admin", "user"]
    return (req, res, next) => {
        // Check if the user's role is included in the allowed roles
        if (!roles.includes(req.user.role)) {
            throw new AppError("You don't have permission for this operation", 403);
        }
        next(); // Proceed to the next middleware or route handler
    };
};

export const isVerified = (req, res, next) => {
    if (!req.user.isVerified) throw new AppError("User is not verified");
    next();
};

import jwt from "jsonwebtoken";
import User from "../features/user/User.js";
import catchAsync from "../utils/catchAsync.js";
import AppError from "../utils/AppError.js";

export const authenticate = catchAsync(async (req, res, next) => {
    let token = "";

    if (req.headers.authorization && req.headers.authorization.startsWith("Bearer ")) {
        token = req.headers.authorization.split(" ")[1];
    }

    if (!token && req.cookies.accessToken) {
        token = req.cookies.accessToken;
    }

    if (!token) {
        throw new AppError("You are not logged in, please log in first!", 401);
    }

    const decoded = await jwt.verify(token, process.env.JWT_SECRET);

    const freshUser = await User.findById(decoded.id);
    if (!freshUser) {
        throw new AppError("The token owner no longer exists", 401);
    }


    req.user = freshUser;
    next();
});

export const authorizeTo = (...roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.user.role)) {
            throw new AppError("You don't have permission for this operation", 403);
        }
        next();
    };
};

export const isVerified = (req, res, next) => {
    if (!req.user.isVerified) throw new AppError("User is not verified");
    next();
};

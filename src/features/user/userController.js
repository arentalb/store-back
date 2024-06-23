import {sendSuccess} from "../../utils/resposeSender.js";
import catchAsync from "../../utils/catchAsync.js";
import AppError from "../../utils/AppError.js";
import userModel from "./User.js";
import bcrypt from "bcrypt";

const getProfile = catchAsync(async (req, res) => {
    const id = req.user.id;
    const user = await userModel.findById(id).select("-password");
    if (user) {
        const responseData = {
            username: user.username,
            email: user.email,
            role: user.role,
            isVerified: user.isVerified,
        };
        sendSuccess(res, responseData, 200);
    } else {
        throw new AppError("User profile not found", 404);
    }
});

const updateProfile = catchAsync(async (req, res) => {
    const id = req.user.id;
    const {username, email} = req.body;
    const user = await userModel.findById(id);
    if (!user) {
        throw new AppError("User profile not found", 404);
    }
    user.username = username;
    user.email = email;

    const updatedUser = await user.save({runValidators: true});
    const userResponse = {
        username: updatedUser.username,
        email: updatedUser.email,
        role: updatedUser.role,
        isVerified: updatedUser.isVerified,
    };

    sendSuccess(res, userResponse, 200);
});

const changePassword = catchAsync(async (req, res) => {
    const {oldPassword, newPassword} = req.body;
    const id = req.user.id;
    const user = await userModel.findById(id);
    if (!user) {
        throw new AppError("User profile not found", 404);
    }
    const isPasswordValid = await bcrypt.compare(oldPassword, user.password);
    if (!isPasswordValid) {
        throw new AppError("Incorrect old password. Please try again or request a password reset.", 401);
    }

    user.password = newPassword;

    await user.save({runValidators: true});

    sendSuccess(res, "Password changed successfully", 200);
});

const getAllUsers = catchAsync(async (req, res) => {
    const allUsers = await userModel.find().select("username email role isVerified createdAt updatedAt active");
    sendSuccess(res, allUsers, 200);
});

const getUserById = catchAsync(async (req, res) => {
    const id = req.params.id;
    if (!id) {
        throw new AppError("Provide user id", 400);
    }
    const user = await userModel.findById(id).select("username email role isVerified createdAt updatedAt active");

    if (user) {
        sendSuccess(res, user, 200);
    } else {
        throw new AppError("User not found", 404);
    }
});

const updateUser = catchAsync(async (req, res) => {
    const id = req.params.id;
    const {active, role} = req.body;

    const adminUserId = req.user.id;
    if (adminUserId === id) {
        throw new AppError("You cannot update your role or your active state", 400);
    }
    if (active === undefined && role === undefined) {
        throw new AppError("Please provide a role or active state to be updated", 400);
    }

    const user = await userModel.findById(id);
    if (!user) {
        throw new AppError("User profile not found", 404);
    }

    let message = "";

    if (role !== undefined) {
        user.role = role;
        message = "Role updated";
    }

    if (active !== undefined) {
        user.active = active;
        message = message ? `${message} and active state updated` : "Active state updated";
    }

    await user.save({runValidators: true});

    sendSuccess(res, message, 200);
});

export default {
    getProfile,
    updateProfile,
    getUserById,
    updateUser,
    getAllUsers,
    changePassword
};

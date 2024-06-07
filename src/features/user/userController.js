import bcrypt from "bcrypt";
import {sendSuccess,} from "../../utils/resposeSender.js";
import catchAsync from "../../utils/catchAsync.js";
import AppError from "../../utils/AppError.js";
import userModel from "./User.js";


const getProfile = catchAsync(async (req, res) => {
    const id = req.user._id;
    const user = await userModel.findById(id).select("-password")
    if (user) {
        const responseData = {
            _id: user._id,
            username: user.username,
            email: user.email,
        };
        sendSuccess(res, responseData, 201);
    } else {
        throw new AppError("User profile not found ", 404)

    }
});
const updateProfile = catchAsync(async (req, res) => {
    const id = req.user._id;
    const user = await userModel.findById(id).select("-password")

    if (user) {
        user.username = req.body.username || user.username;
        user.email = req.body.email || user.email;

        if (req.body.password) {
            const salt = await bcrypt.genSalt();
            user.password = await bcrypt.hash(req.body.password, salt);
        }
        const updatedUser = await user.save();
        sendSuccess(res, updatedUser, 201);
    } else {
        throw new AppError("User profile not found ", 404)

    }
});

const getAllUser = catchAsync(async (req, res) => {
    const allUsers = await userModel.find().select("-password")

    sendSuccess(res, allUsers, 201);
});
const getUserById = catchAsync(async (req, res) => {
    const id = req.params.id;
    if (!id) {
        throw new AppError("Provide user id", 404)
    }

    const user = await userModel.findById(id).select("-password")

    if (user) {
        sendSuccess(res, user, 201);
    } else {
        throw new AppError("User not found", 404)
    }
});
const updateUserById = catchAsync(async (req, res) => {
    const id = req.params.id;
    const user = await userModel.findById(id).select("-password")

    if (user) {
        user.username = req.body.username || user.username;
        user.email = req.body.email || user.email;
        user.isAdmin = Boolean(req.body.isAdmin);

        const updatedUser = await user.save();
        const resposeData = {
            _id: updatedUser._id,
            username: updatedUser.username,
            email: updatedUser.email,
            isAdmin: updatedUser.isAdmin,
        };
        sendSuccess(res, resposeData, 201);
    } else {
        throw new AppError("User profile not found ", 404)

    }
});
const deleteUserById = catchAsync(async (req, res) => {
    const id = req.params.id;
    if (!id) {
        throw new AppError("Provide user id", 404)

    }

    const user = await userModel.findById(id).select("-password")

    if (user) {
        if (user.isAdmin) {
            throw new AppError("Admin user can not be deleted", 400)

        }
        await userModel.deleteOne({_id: id});
        sendSuccess(res, "User removed", 201);
    } else {
        throw new AppError("User not found ", 404)

    }
});

export default {
    getAllUser,
    getProfile,
    updateProfile,
    deleteUserById,
    getUserById,
    updateUserById,
};

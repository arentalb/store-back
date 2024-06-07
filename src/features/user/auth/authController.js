import {sendSuccess} from "../../../utils/resposeSender.js";
import bcrypt from "bcrypt";
import createToken from "../../../utils/createToken.js";
import catchAsync from "../../../utils/catchAsync.js";
import AppError from "../../../utils/AppError.js";
import userModel from "../userModel.js";

const register = catchAsync(async (req, res) => {
    const {username, email, password} = req.body;
    if (!username || !email || !password) {
        throw new AppError("Please provide all inputs", 400)
    }

    const userExists = await userModel.findOne({email: email});
    if (userExists) {
        throw new AppError("User already exists with that email", 409)
    } else {
        const salt = await bcrypt.genSalt();
        const hashedPassword = await bcrypt.hash(password, salt);
        const newUser = await userModel.create({
            username,
            email,
            password: hashedPassword,
        })


        const token = createToken(newUser._id);
        const userResponse = {
            _id: newUser._id,
            username: newUser.username,
            email: newUser.email,
            isAdmin: newUser.isAdmin,
            token,
        };
        sendSuccess(res, userResponse, 201);
    }
});


const login = catchAsync(async (req, res) => {
    const {email, password} = req.body;
    if (!email || !password) {
        throw new AppError("Please provide all inputs", 400)

    }
    const existingUser = await userModel.findOne({email: email});
    console.log(existingUser)
    console.log(password)
    if (existingUser) {
        const isPasswordValid = await bcrypt.compare(
            password,
            existingUser.password,
        );
        console.log("after")
        if (isPasswordValid) {
            const token = createToken(existingUser._id);
            const userResponse = {
                _id: existingUser._id,
                username: existingUser.username,
                email: existingUser.email,
                isAdmin: existingUser.isAdmin,
                token,
            };
            sendSuccess(res, userResponse, 201);
        } else {
            throw new AppError("Wrong password", 401)

        }
    } else {
        throw new AppError("User does not exist", 404)

    }
});

const logout = catchAsync(async (req, res) => {
    sendSuccess(res, "Logout successfully", 200);
});


export default {
    register, logout, login
};

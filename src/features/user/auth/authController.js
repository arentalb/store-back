import {sendSuccess} from "../../../utils/resposeSender.js";
import bcrypt from "bcrypt";
import catchAsync from "../../../utils/catchAsync.js";
import AppError from "../../../utils/AppError.js";
import User from "../User.js";
import jwt from "jsonwebtoken";
import createToken from "../../../utils/createToken.js";
import sendEmail from "../../../utils/email.js";
import crypto from "crypto";

const parseDuration = (duration) => {
    const timeUnits = {
        s: 1000,        // seconds
        m: 1000 * 60,   // minutes
        h: 1000 * 60 * 60,  // hours
        d: 1000 * 60 * 60 * 24  // days
    };

    const match = duration.match(/^(\d+)([smhd])$/);
    if (!match) {
        throw new Error("Invalid duration format");
    }

    const value = parseInt(match[1], 10);
    const unit = match[2];

    return value * timeUnits[unit];
};


const setCookie = (res, name, token, maxAge) => {
    let maxAgeInMs;

    try {
        maxAgeInMs = parseDuration(maxAge); // Convert human-readable duration to milliseconds
    } catch (error) {
        throw new Error("Invalid maxAge format. Use a format like '1h' or '2d'.");
    }

    res.cookie(name, token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        maxAge: maxAgeInMs || process.env.COOKIE_EXPIRES_IN,
    });
};


const register = catchAsync(async (req, res) => {
    const {username, email, password} = req.body;
    if (!username || !email || !password) {
        throw new AppError("Please provide all inputs", 400);
    }

    const userExists = await User.findOne({email: email});
    if (userExists) {
        throw new AppError("User already exists with that email", 409);
    } else {

        await User.create({
            username,
            email,
            password,
        });

        // const {accessToken, refreshToken} = createToken(newUser._id);
        //
        // newUser.refreshToken = refreshToken;
        // await newUser.save();
        //
        // setCookie(res, "accessToken", accessToken ,process.env.COOKIE_EXPIRES_IN)
        // setCookie(res, "refreshToken", refreshToken,process.env.COOKIE_REFRESH_EXPIRES_IN)
        // const userResponse = {
        //     username: newUser.username,
        //     email: newUser.email,
        //     role: newUser.role,
        //     isVerified: newUser.isVerified
        // };
        sendSuccess(res, "User registered please verify then login ", 201);
    }
});

const login = catchAsync(async (req, res) => {
    const {email, password} = req.body;
    if (!email || !password) {
        throw new AppError("Please provide all inputs", 400);
    }

    const existingUser = await User.findOne({email});
    if (existingUser) {
        const isPasswordValid = await bcrypt.compare(password, existingUser.password);
        if (isPasswordValid) {
            if (!existingUser.isVerified) throw new AppError("User is not verified")

            const {accessToken, refreshToken} = createToken(existingUser._id);

            existingUser.refreshToken = refreshToken;
            await existingUser.save();

            setCookie(res, "accessToken", accessToken, process.env.COOKIE_EXPIRES_IN)
            setCookie(res, "refreshToken", refreshToken, process.env.COOKIE_REFRESH_EXPIRES_IN)


            const userResponse = {
                username: existingUser.username,
                email: existingUser.email,
                role: existingUser.role,
                isVerified: existingUser.isVerified
            };
            sendSuccess(res, userResponse, 200);
        } else {
            throw new AppError("Wrong password", 401);
        }
    } else {
        throw new AppError("User does not exist", 404);
    }
});

const logout = catchAsync(async (req, res) => {
    const {refreshToken} = req.cookies;

    if (refreshToken) {
        const existingUser = await User.findOne({refreshToken});
        if (existingUser) {
            existingUser.refreshToken = null;
            await existingUser.save();
        }
    }
    setCookie(res, "accessToken", '', "0m");
    setCookie(res, "refreshToken", '', "0m");
    sendSuccess(res, "Logout successfully", 200);
});

const refresh = catchAsync(async (req, res) => {
    const {refreshToken} = req.cookies;
    if (!refreshToken) {
        throw new AppError("Refresh token is required", 400);
    }

    const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);

    const existingUser = await User.findById(decoded.id);
    if (!existingUser || existingUser.refreshToken !== refreshToken) {
        throw new AppError("Invalid refresh token", 401);
    }

    const {accessToken, refreshToken: newRefreshToken} = createToken(decoded.id);

    existingUser.refreshToken = newRefreshToken;
    await existingUser.save();


    setCookie(res, "accessToken", accessToken, process.env.COOKIE_EXPIRES_IN)
    setCookie(res, "refreshToken", refreshToken, process.env.COOKIE_REFRESH_EXPIRES_IN)
    sendSuccess(res, "Token refreshed successfully", 200);
});

const emailVerificationRequest = catchAsync(async (req, res) => {

    if (!req.body.email) throw new AppError("Please provide email ");

    const user = await User.findOne({email: req.body.email});
    if (!user) throw new AppError("User with that email dose not exists ");

    const token = crypto.randomBytes(32).toString('hex');
    user.emailVerificationToken = token;


    const expiresInMs = parseDuration(process.env.EMAIL_VERIFICATION_EXPIRES_IN);
    user.emailVerificationExpires = Date.now() + expiresInMs;

    await user.save();


    const link = `${req.protocol}://${req.get("host")}/api/v1/auth/verify-email/confirm?token=${token}`;
    const message = `Please visit this link to verify your email`;

    await sendEmail({
        email: user.email,
        subject: "Your link for verify your email :)",
        message: message,
        link: link
    });
    sendSuccess(res, "Verify email send successfully ", 200);

})

const emailVerificationConfirm = catchAsync(async (req, res) => {
    const token = req.query.token;
    if (!token) throw new AppError("Provide a token ")
    const user = await User.findOne({emailVerificationToken: token});
    if (!user || user.emailVerificationExpires < Date.now()) {
        throw new AppError("Invalid or expired token", 400);
    }
    user.isVerified = true;
    user.emailVerificationToken = undefined
    user.emailVerificationExpires = undefined
    await user.save();

    sendSuccess(res, "Email verified successfully", 200);
});

const resetPasswordRequest = catchAsync(async (req, res) => {

    if (!req.body.email) throw new AppError("Please provide email ");

    const user = await User.findOne({email: req.body.email});
    if (!user) throw new AppError("User with that email dose not exists ");
    const token = crypto.randomBytes(32).toString('hex');
    user.resetPasswordToken = token;

    const expiresInMs = parseDuration(process.env.RESET_PASSWORD_EXPIRES_IN);
    user.resetPasswordExpires = Date.now() + expiresInMs;

    await user.save();

    const link = `${req.protocol}://${req.get("host")}/api/v1/auth/password-reset/confirm?token=${token}`;
    const message = `Please visit link below to verify your email `;

    await sendEmail({
        email: user.email,
        subject: "Your link for reset your password :)",
        message: message,
        link: link
    });
    sendSuccess(res, "Reset password email send successfully ", 200);

})

const resetPasswordConfirm = catchAsync(async (req, res) => {
    const token = req.query.token;
    const newPassword = req.body.password
    if (!token) throw new AppError("Provide a token ")
    if (!newPassword) throw new AppError("Provide new password")

    const user = await User.findOne({resetPasswordToken: token});
    if (!user || user.resetPasswordExpires < Date.now()) {
        throw new AppError("Invalid or expired token", 400);
    }

    user.password = newPassword;
    user.resetPasswordToken = undefined
    user.resetPasswordExpires = undefined
    await user.save({runValidators: true});

    sendSuccess(res, "Password reset is done  ", 200);
});

export default {
    register,
    logout,
    login,
    refresh,
    emailVerificationRequest,
    emailVerificationConfirm,
    resetPasswordRequest,
    resetPasswordConfirm
};

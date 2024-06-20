import {sendSuccess} from "../../../utils/resposeSender.js";
import bcrypt from "bcrypt";
import catchAsync from "../../../utils/catchAsync.js";
import AppError from "../../../utils/AppError.js";
import User from "../User.js";
import jwt from "jsonwebtoken";
import createToken from "../../../utils/createToken.js";
import sendEmail from "../../../utils/email.js";
import crypto from "crypto";
import parseDuration from "../../../utils/parseDuration.js";

const setCookie = (res, name, token, maxAge) => {
    let maxAgeInMs;

    try {
        maxAgeInMs = parseDuration(maxAge); // Convert human-readable duration to milliseconds
    } catch (error) {
        throw new Error("Invalid maxAge format. Use a format like '1h' or '2d'.");
    }

    const cookieOptions = {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: process.env.NODE_ENV === 'production' ? 'None' : 'Lax',
        maxAge: maxAgeInMs,
        path: '/',
    };

    res.cookie(name, token, cookieOptions);
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

        sendSuccess(res, "User registered", 201);
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
            const {accessToken, refreshToken} = createToken(existingUser._id);

            existingUser.refreshToken = refreshToken;
            await existingUser.save();

            setCookie(res, "refreshToken", refreshToken, process.env.COOKIE_REFRESH_EXPIRES_IN);

            const userResponse = {
                username: existingUser.username,
                email: existingUser.email,
                role: existingUser.role,
                isVerified: existingUser.isVerified,
                accessToken,
                refreshToken
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
    const {refreshToken} = req.body;  // Read refreshToken from request body
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

    const userResponse = {
        accessToken,        // Include accessToken in response for local storage
        refreshToken: newRefreshToken  // Include new refreshToken in response for local storage
    };
    sendSuccess(res, userResponse, 200);
});

const emailVerificationRequest = catchAsync(async (req, res) => {
    if (!req.body.email) throw new AppError("Please provide email", 400);

    const user = await User.findOne({email: req.body.email});
    if (!user) throw new AppError("User with that email does not exist", 404);

    const token = crypto.randomBytes(32).toString('hex');
    user.emailVerificationToken = token;

    const expiresInMs = parseDuration(process.env.EMAIL_VERIFICATION_EXPIRES_IN);
    user.emailVerificationExpires = Date.now() + expiresInMs;

    await user.save();

    const link = `${process.env.FRONTEND_BASE_URL}/verify-email-confirm?token=${token}`;
    const subject = 'Verify Your Email Address';
    const message = 'Please visit this link to verify your email.';

    await sendEmail({
        type: 'verifyEmail',
        email: user.email,
        subject: subject,
        message: message,
        link: link,
    });

    sendSuccess(res, "Verify email sent successfully", 200);
});

const emailVerificationConfirm = catchAsync(async (req, res) => {
    const token = req.query.token;
    if (!token) throw new AppError("Provide a token", 400);
    const user = await User.findOne({emailVerificationToken: token});
    if (!user || user.emailVerificationExpires < Date.now()) {
        throw new AppError("Invalid or expired token", 400);
    }
    user.isVerified = true;
    user.emailVerificationToken = undefined;
    user.emailVerificationExpires = undefined;
    await user.save();

    sendSuccess(res, "Email verified successfully", 200);
});

const resetPasswordRequest = catchAsync(async (req, res) => {
    if (!req.body.email) throw new AppError("Please provide email", 400);

    const user = await User.findOne({email: req.body.email});
    if (!user) throw new AppError("User with that email does not exist", 404);
    const token = crypto.randomBytes(32).toString('hex');
    user.resetPasswordToken = token;

    const expiresInMs = parseDuration(process.env.RESET_PASSWORD_EXPIRES_IN);
    user.resetPasswordExpires = Date.now() + expiresInMs;

    await user.save();

    const link = `${process.env.FRONTEND_BASE_URL}/reset-password-confirm?token=${token}`;
    const subject = 'Reset Your Password';
    const message = 'Click the link below to reset your password.';

    await sendEmail({
        type: 'resetPassword',
        email: user.email,
        subject: subject,
        message: message,
        link: link,
    });

    sendSuccess(res, "Reset password email sent successfully", 200);
});

const resetPasswordConfirm = catchAsync(async (req, res) => {
    const token = req.query.token;
    const newPassword = req.body.password;
    if (!token) throw new AppError("Provide a token", 400);
    if (!newPassword) throw new AppError("Provide new password", 400);

    const user = await User.findOne({resetPasswordToken: token});
    if (!user || user.resetPasswordExpires < Date.now()) {
        throw new AppError("Invalid or expired token", 400);
    }

    user.password = newPassword;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save({runValidators: true});

    sendSuccess(res, "Password reset is done", 200);
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

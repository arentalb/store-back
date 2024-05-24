import expressAsyncHandler from "express-async-handler";
import userService from "./userService.js";
import bcrypt from "bcrypt";
import createToken from "../../utils/createToken.js";
import {
  sendError,
  sendFailure,
  sendSuccess,
} from "../../utils/resposeSender.js";

const registerUser = expressAsyncHandler(async (req, res) => {
  const { username, email, password } = req.body;
  if (!username || !email || !password) {
    sendFailure(res, "Please provide all inputs", 400);
    return;
  }

  const userExists = await userService.getUserByEmail(email);
  if (userExists) {
    sendFailure(res, "User already exists with that email", 409);
  } else {
    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = await userService.createUser({
      username,
      email,
      password: hashedPassword,
    });
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
const loginUser = expressAsyncHandler(async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    sendFailure(res, "Please provide all inputs", 400);
    return;
  }
  const existingUser = await userService.getUserByEmail(email);
  if (existingUser) {
    const isPasswordValid = await bcrypt.compare(
      password,
      existingUser.password,
    );
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
      sendFailure(res, "Wrong password", 401);
    }
  } else {
    sendFailure(res, "User does not exist", 404);
  }
});
const logoutUser = expressAsyncHandler(async (req, res) => {
  sendSuccess(res, "Logout successfully", 200);
});

const getProfile = expressAsyncHandler(async (req, res) => {
  const id = req.user._id;
  const user = await userService.getUserById(id);
  if (user) {
    const responseData = {
      _id: user._id,
      username: user.username,
      email: user.email,
    };
    sendSuccess(res, responseData, 201);
  } else {
    sendFailure(res, "User profile not found ", 404);
  }
});
const updateProfile = expressAsyncHandler(async (req, res) => {
  const id = req.user._id;
  const user = await userService.getUserById(id);

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
    sendFailure(res, "User profile not found ", 404);
  }
});

const getAllUser = expressAsyncHandler(async (req, res) => {
  const allUsers = await userService.getAllUser();
  sendSuccess(res, allUsers, 201);
});
const getUserById = expressAsyncHandler(async (req, res) => {
  const id = req.params.id;
  if (!id) {
    sendError(res, "Provide user id", 400);
    return;
  }

  const user = await userService.getUserById(id);

  if (user) {
    sendSuccess(res, user, 201);
  } else {
    sendFailure(res, "User not found", 404);
  }
});
const updateUserById = expressAsyncHandler(async (req, res) => {
  const id = req.params.id;
  const user = await userService.getUserById(id);

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
    sendFailure(res, "User profile not found ", 404);
  }
});
const deleteUserById = expressAsyncHandler(async (req, res) => {
  const id = req.params.id;
  if (!id) {
    sendFailure(res, "Provide user id", 400);
    return;
  }

  const user = await userService.getUserById(id);

  if (user) {
    if (user.isAdmin) {
      sendFailure(res, "Admin user can not be deleted", 400);

      return;
    }
    await userService.deleteUser(id);
    sendSuccess(res, "User removed", 201);
  } else {
    sendFailure(res, "User not found ", 404);
  }
});

export default {
  registerUser,
  loginUser,
  logoutUser,
  getAllUser,
  getProfile,
  updateProfile,
  deleteUserById,
  getUserById,
  updateUserById,
};

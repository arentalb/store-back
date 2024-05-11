import expressAsyncHandler from "express-async-handler";
import userService from "../service/userService.js";
import bcrypt from "bcrypt";
import createToken from "../utils/createToken.js";

const registerUser = expressAsyncHandler(async (req, res) => {
  const { username, email, password } = req.body;
  if (!username || !email || !password) {
    res.status(400).json({ message: "Please provide all inputs" });
  }

  const userExists = await userService.getUserByEmail(email);
  if (userExists) {
    res.status(409).json({ message: "User already exists with that email" });
  } else {
    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = await userService.createUser({
      username,
      email,
      password: hashedPassword,
    });
    createToken(res, newUser._id);
    const userResponse = {
      _id: newUser._id,
      username: newUser.username,
      email: newUser.email,
      isAdmin: newUser.isAdmin,
    };
    res.status(201).json(userResponse);
  }
});

const loginUser = expressAsyncHandler(async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    res.status(400).json({ message: "Please provide all inputs" });
    return;
  }
  const existingUser = await userService.getUserByEmail(email);
  if (existingUser) {
    const isPasswordValid = await bcrypt.compare(
      password,
      existingUser.password,
    );
    if (isPasswordValid) {
      createToken(res, existingUser._id);
      const userResponse = {
        _id: existingUser._id,
        username: existingUser.username,
        email: existingUser.email,
        isAdmin: existingUser.isAdmin,
      };
      res.status(201).json(userResponse);
    } else {
      res.status(401).json({ message: "Wrong password" });
    }
  } else {
    res.status(404).json({ message: "User dose not exists " });
  }
});
const logoutUser = expressAsyncHandler(async (req, res) => {
  res.cookie("jwt", "", {
    httpOnly: true,
    expires: new Date(0),
  });
  res.status(200).json({ message: "Logout successfully" });
});

const getAllUser = expressAsyncHandler(async (req, res) => {
  const allUsers = await userService.getAllUser();
  res.status(201).json(allUsers);
});

const getCurrentUserProfile = expressAsyncHandler(async (req, res) => {
  const id = req.user._id;
  const user = await userService.getUserProfile(id);
  if (user) {
    res.status(201).json({
      _id: user._id,
      username: user.username,
      email: user.email,
    });
  } else {
    res.status(404).json({ message: "User profile not found " });
  }
});

const updateCurrentUserProfile = expressAsyncHandler(async (req, res) => {
  const id = req.user._id;
  const user = await userService.getUserProfile(id);

  if (user) {
    user.username = req.body.username || user.username;
    user.email = req.body.email || user.email;

    if (req.body.password) {
      const salt = await bcrypt.genSalt();
      user.password = await bcrypt.hash(req.body.password, salt);
    }
    const updatedUser = await user.save();
    res.json({
      _id: updatedUser._id,
      username: updatedUser.username,
      email: updatedUser.email,
      isAdmin: updatedUser.isAdmin,
    });
  } else {
    res.status(404).json({ message: "User profile not found " });
  }
});

const deleteUser = expressAsyncHandler(async (req, res) => {
  const id = req.params.id;
  if (!id) {
    res.status(400).json({ message: "Provide user id" });
    return;
  }

  const user = await userService.getUserProfile(id);

  if (user) {
    if (user.isAdmin) {
      res.status(400).json({ message: "Admin user can not be deleted" });
      return;
    }
    await userService.deleteUser(id);
    res.status(201).json({ message: "user removed" });
  } else {
    res.status(404).json({ message: "User not found " });
  }
});

const getUserById = expressAsyncHandler(async (req, res) => {
  const id = req.params.id;
  if (!id) {
    res.status(400).json({ message: "Provide user id" });
    return;
  }

  const user = await userService.getUserProfile(id);

  if (user) {
    res.status(201).json(user);
  } else {
    res.status(404).json({ message: "User not found" });
  }
});
export default {
  registerUser,
  loginUser,
  logoutUser,
  getAllUser,
  getCurrentUserProfile,
  updateCurrentUserProfile,
  deleteUser,
  getUserById,
};

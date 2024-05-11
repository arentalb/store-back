import jwt from "jsonwebtoken";
import expressAsyncHandler from "express-async-handler";
import userService from "../service/userService.js";

const authenticate = expressAsyncHandler(async (req, res, next) => {
  let token = req.cookies.jwt;
  console.log(token);
  if (token) {
    try {
      const decode = jwt.verify(token, process.env.JWT_SECRET);
      req.user = await userService.getUserById(decode.userId);
      next();
    } catch (error) {
      res.status(401).json({ message: "Not authorized ,token failed." });
      next();
    }
  } else {
    res.status(401).json({ message: "Not authorized , no token." });
    next();
  }
});

const authorizeAdmin = expressAsyncHandler(async (req, res, next) => {
  if (req.user && req.user.isAdmin) {
    next();
  } else {
    res.status(401).json({ message: "Not authorized as admin" });
    next();
  }
});

export { authenticate, authorizeAdmin };

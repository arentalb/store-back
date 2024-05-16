import jwt from "jsonwebtoken";
import expressAsyncHandler from "express-async-handler";
import userService from "../features/user/userService.js";
import { sendFailure } from "../utils/resposeSender.js";

const authenticate = expressAsyncHandler(async (req, res, next) => {
  let token = req.cookies.jwt;
  console.log(token);
  if (token) {
    try {
      const decode = jwt.verify(token, process.env.JWT_SECRET);
      req.user = await userService.getUserById(decode.userId);
      next();
    } catch (error) {
      sendFailure(res, "Not authorized ,token failed.", 401);

      next();
    }
  } else {
    sendFailure(res, "Not authorized , no token.", 401);
    next();
  }
});

const authorizeAdmin = expressAsyncHandler(async (req, res, next) => {
  if (req.user && req.user.isAdmin) {
    next();
  } else {
    sendFailure(res, "Not authorized as admin", 401);
    next();
  }
});

export { authenticate, authorizeAdmin };

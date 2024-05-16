import express from "express";
import dotenv from "dotenv";

import { connectDB } from "./src/config/db.js";
import userRoutes from "./src/routes/userRoutes.js";
import uploadRoutes from "./src/utils/fileupload.js";

import cookieParser from "cookie-parser";
import { sendError, sendFailure } from "./src/utils/resposeSender.js";
import categoryRoutes from "./src/routes/categoryRoutes.js";
import path from "path";

dotenv.config();
const PORT = process.env.PORT || 5000;

await connectDB();

const server = express();
server.use(cookieParser());

server.use(express.json());
server.use(express.urlencoded({ extended: true }));

server.use("/api/user", userRoutes);
server.use("/api/category", categoryRoutes);
server.use("/api/upload", uploadRoutes);

const __dirname = path.resolve();
server.use("/uploads", express.static(path.join(__dirname + "/uploads")));

server.use((err, req, res, next) => {
  console.log(err);
  if (err instanceof SyntaxError) {
    sendFailure(res, err.message || "Invalid JSON payload provided", 400);
  } else {
    sendError(res, err.message || "Internal server error", 500);
  }
});

server.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});

import express from "express";
import dotenv from "dotenv";

import { connectDB } from "./src/config/db.js";
import userRoutes from "./src/features/user/userRoutes.js";

import cookieParser from "cookie-parser";
import { sendError, sendFailure } from "./src/utils/resposeSender.js";
import cartRoutes from "./src/features/cart/cartRoutes.js";
import categoryRoutes from "./src/features/category/categoryRoutes.js";

import path from "path";
import productRoutes from "./src/features/product/productRoutes.js";
import orderRoutes from "./src/features/order/orderRoutes.js";
import cors from "cors";

dotenv.config();
const PORT = process.env.PORT || 5000;

await connectDB();

const server = express();
server.use(
  cors({
    origin: "https://supermarket-front-m1ll.onrender.com",
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  }),
);
server.use(cookieParser());

server.use(express.json());
server.use(express.urlencoded({ extended: true }));

server.use("/api/user", userRoutes);
server.use("/api/category", categoryRoutes);
server.use("/api/product", productRoutes);
server.use("/api/cart", cartRoutes);
server.use("/api/order", orderRoutes);
server.use("/isup", (req, res) => {
  res.send("Server is up and works");
});

const __dirname = path.resolve();
server.use("/uploads", express.static(path.join(__dirname + "/uploads")));

server.use((err, req, res, next) => {
  if (err instanceof SyntaxError) {
    sendFailure(res, err.message || "Invalid JSON payload provided", 400);
  } else {
    sendError(res, err.message || "Internal server error", 500);
  }
});

server.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});

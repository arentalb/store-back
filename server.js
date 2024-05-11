import express from "express";
import dotenv from "dotenv";

import { connectDB } from "./src/config/db.js";
import userRoutes from "./src/routes/userRoutes.js";
import cookieParser from "cookie-parser";

dotenv.config();
const PORT = process.env.PORT || 5000;

await connectDB();

const server = express();
server.use(cookieParser());

server.use(express.json());
server.use(express.urlencoded({ extended: true }));

server.use("/api/user", userRoutes);

server.use((err, req, res, next) => {
  res.status(500).send({ message: err.message || "Internal Server Error" });
});

server.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});

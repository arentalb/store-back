import dotenv from "dotenv";
import mongoose from "mongoose";
import app from "./app.js";

dotenv.config();

process.on("uncaughtException", (err) => {
    console.log("Uncaught Exception, Shutting down ...");
    console.log(err.name, err.message);
    process.exit(1);
});


const DB = process.env.DATABASE.replace(
    "<password>",
    process.env.DATABASE_PASSWORD,
);
mongoose.connect(DB, {}).then(() => {
    console.log("connected");
});
const port = process.env.PORT || 6060;
const server = app.listen(port, () => {
    console.log(`server is running on port ${port}`);
});


process.on("unhandledRejection", (err) => {
    console.log("Unhandled Rejection , Shutting down ...");
    console.log(err.name, err.message);
    server.close(() => {
        process.exit(1);
    });
});

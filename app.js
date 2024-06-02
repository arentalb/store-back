import mongoSanitize from "express-mongo-sanitize";
import rateLimit from "express-rate-limit";
import cookieParser from "cookie-parser";
import xssClean from "xss-clean";
import morgan from "morgan";
import helmet from "helmet";
import cors from "cors";
import hpp from "hpp";
import userRoutes from "./src/features/user/userRoutes.js";
import categoryRoutes from "./src/features/category/categoryRoutes.js";
import productRoutes from "./src/features/product/productRoutes.js";
import cartRoutes from "./src/features/cart/cartRoutes.js";
import orderRoutes from "./src/features/order/orderRoutes.js";
import errorHandler from "./src/utils/errorHandler.js";
import {GeneralError} from "./src/utils/errors.js";
import express from "express"
import path from "path";

const app = express();

if (process.env.NODE_ENV === "development") {
    app.use(morgan("dev"));
}
const limiter = rateLimit({
    max: 100,
    windowMs: 60 * 60 * 1000,
    message: "Too many requests from this IP, please try again in 1 hour (:",
});
app.use(
    hpp({
        whitelist: [
            ""
        ],
    }),
);
app.use(
    cors({
        origin: "https://supermarket-front-m1ll.onrender.com",
        methods: ["GET", "POST", "PUT", "DELETE"],
        credentials: true,
    }),
);

app.use(express.urlencoded({extended: true}));
app.use(express.json({limit: "10kb"}));
app.use(mongoSanitize());
app.use("/api", limiter);
app.use(cookieParser());
app.use(express.json());
app.use(xssClean());
app.use(helmet());

const __dirname = path.resolve();
app.use("/public", express.static(path.join(__dirname + "/public")));


app.use("/api/user", userRoutes);
app.use("/api/category", categoryRoutes);
app.use("/api/product", productRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/order", orderRoutes);


app.all("*", (req, res, next) => {
    next(new GeneralError(`Cannot find ${req.originalUrl} on this server`, 404));
});

app.use(errorHandler);

export default app;

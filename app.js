import express from "express";
import mongoSanitize from "express-mongo-sanitize";
import rateLimit from "express-rate-limit";
import cookieParser from "cookie-parser";
import xssClean from "xss-clean";
import morgan from "morgan";
import helmet from "helmet";
import cors from "cors";
import hpp from "hpp";
import path from "path";
import GlobalErrorHandler from "./src/utils/AppErrorHandler.js";
import routes from "./src/routes.js";
import dotenv from "dotenv";
import parseDuration from "./src/utils/parseDuration.js";

dotenv.config();

const app = express();

if (process.env.NODE_ENV === "development") {
    app.use(morgan("dev"));
}


const limiter = rateLimit({
    max: process.env.RATE_LIMIT_MAX,
    windowMs: parseDuration(process.env.RATE_LIMIT_WINDOW_MS),
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
        origin: process.env.CORS_ORIGIN,
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
// Middleware to set the Cross-Origin-Resource-Policy header
app.use('/public/images', (req, res, next) => {
    res.setHeader('Cross-Origin-Resource-Policy', 'cross-origin');
    next();
}, express.static(path.join(__dirname + "/public/images")));

app.use("/api/v1", routes);
app.get("/test", (req, res, next) => {
    res.send("server is running ")
})
app.use(GlobalErrorHandler);

export default app;

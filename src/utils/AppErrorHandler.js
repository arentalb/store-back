import AppError from "./AppError.js";


export default (err, req, res, next) => {
    console.error(err)
    err.statusCode = err.statusCode || 500;
    err.status = err.status || "error";
    if (process.env.NODE_ENV === "development") {
        sendErrorDev(err, res);
    } else if (process.env.NODE_ENV === "production") {
        if (err.name === "CastError") {
            err = handelCastErrorDB(err);

            console.log(1)
        }
        if (err.name === "ValidationError") {
            err = handelValidationErrorDB(err);
            console.log(2)

        }
        if (err.code === 11000) {
            err = handleDuplicateFieldsDB(err);
            console.log(3)

        }
        if (err.name === "JsonWebTokenError") {
            err = handelInvalidToken();
            console.log(4)

        }
        if (err.name === "TokenExpiredError") {
            err = handelTokenExpiration();
            console.log(5)

        }

        sendErrorProd(err, res);
    }
};

const handelCastErrorDB = (err) => {
    const message = `Invalid ${err.path} : ${err.value}`;
    return new AppError(message, 400);
};
const handelValidationErrorDB = (err) => {
    const errors = Object.values(err.errors).map((el) => el.message);
    const message = `Invalid input -> ${errors.join(" || ")}`;
    return new AppError(message, 400);
};
const handleDuplicateFieldsDB = (err) => {
    const {keyValue} = err;
    const key = Object.keys(keyValue)[0];
    const value = keyValue[key];

    const message = `Duplicate field ${key} : ${value}`;
    return new AppError(message, 400);
};

const handelInvalidToken = () => {
    return new AppError("Invalid Token", 400);
};
const handelTokenExpiration = () => {
    return new AppError("Your token has been expired ", 400);
};
const sendErrorDev = (err, res) => {
    res.status(err.statusCode).json({
        status: err.status,
        message: err.message,
        stack: err.stack,
        error: err,
    });
};

const sendErrorProd = (err, res) => {
    if (err.isOperational) {
        //operational error send the error message to the client
        res.status(err.statusCode).json({
            status: err.status,
            message: err.message,
        });
    } else {
        res.status(500).json({message: "Something went wrong "});
    }
};

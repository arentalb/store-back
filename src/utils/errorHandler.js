import {GeneralError} from "./errors.js"

export default (err, req, res) => {
    err.statusCode = err.statusCode || 500;
    err.status = err.status || "error";
    if (process.env.NODE_ENV === "development") {
        sendErrorDev(err, res);
    } else if (process.env.NODE_ENV === "production") {
        let error = {...err};
        if (err.name === "CastError") error = handelCastErrorDB(error);
        if (err.name === "ValidationError") {
            error = handelValidationErrorDB(error);
        }
        if (err.code === 11000) {
            error = handleDuplicateFieldsDB(error);
        }
        if (err.name === "JsonWebTokenError") {
            error = handelInvalidToken();
        }
        if (err.name === "TokenExpiredError") {
            error = handelTokenExpiration();
        }

        sendErrorProd(error, res);
    }
};

const handelCastErrorDB = (err) => {
    const message = `Invalid ${err.path} : ${err.value}`;
    return new GeneralError(message, 400);
};
const handelValidationErrorDB = (err) => {
    const errors = Object.values(err.errors).map((el) => el.message);
    const message = `Invalid input -> ${errors.join(" || ")}`;
    return new GeneralError(message, 400);
};
const handleDuplicateFieldsDB = (err) => {
    const {keyValue} = err;
    const key = Object.keys(keyValue)[0];
    const value = keyValue[key];

    const message = `Duplicate field ${key} : ${value}`;
    return new GeneralError(message, 400);
};

const handelInvalidToken = () => {
    return new GeneralError("Invalid Token", 400);
};
const handelTokenExpiration = () => {
    return new GeneralError("Your token has been expired ", 400);
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

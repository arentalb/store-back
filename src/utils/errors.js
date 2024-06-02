class GeneralError extends Error {
    constructor(message, statusCode) {
        super(message);
        this.statusCode = statusCode;
        this.status = `${this.statusCode}`.startsWith("4") ? "fail" : "error";
        this.isOperational = true;
        Error.captureStackTrace(this, this.constructor);
    }
}

class InvalidInputError extends GeneralError {
    constructor(message) {
        super(message || 'Invalid input', 400);
    }
}

class ResourceNotFoundError extends GeneralError {
    constructor(message) {
        super(message || 'Resource not found', 404);
    }
}

export {GeneralError, InvalidInputError, ResourceNotFoundError};

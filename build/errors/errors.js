"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ZodFriendlyError = exports.ConflictError = exports.UnauthorizedError = exports.InternalServerError = exports.BadRequestError = exports.NotFoundError = exports.CustomError = void 0;
const errors_codes_1 = require("./errors.codes");
class CustomError extends Error {
    constructor(message, status, code) {
        super(message);
        this.status = status;
        this.code = code;
    }
    toString() {
        return {
            status: this.status,
            message: this.message,
            code: this.code,
        };
    }
}
exports.CustomError = CustomError;
class NotFoundError extends CustomError {
    constructor(message, code = errors_codes_1.ErrorCodes.NOT_FOUND) {
        super(message, 404, code);
    }
}
exports.NotFoundError = NotFoundError;
class BadRequestError extends CustomError {
    constructor(message, code = errors_codes_1.ErrorCodes.BAD_REQUEST) {
        super(message, 400, code);
    }
}
exports.BadRequestError = BadRequestError;
class InternalServerError extends CustomError {
    constructor(message, code = errors_codes_1.ErrorCodes.INTERNAL_SERVER_ERROR) {
        super(message, 500, code);
    }
}
exports.InternalServerError = InternalServerError;
class UnauthorizedError extends CustomError {
    constructor(message, code = errors_codes_1.ErrorCodes.UNAUTHORIZED) {
        super(message, 401, code);
    }
}
exports.UnauthorizedError = UnauthorizedError;
class ConflictError extends CustomError {
    constructor(message, code = errors_codes_1.ErrorCodes.CONFLICT) {
        super(message, 409, code);
    }
}
exports.ConflictError = ConflictError;
class ZodFriendlyError extends CustomError {
    constructor(zodError) {
        super("invalid request", 400, errors_codes_1.ErrorCodes.ZOD_VALIDATION_FAILED);
        this.error = zodError;
    }
    toString() {
        return {
            status: this.status,
            message: this.message,
            errors: Object.fromEntries(this.error.errors.map((err) => [err.path.join("."), err.message])),
            code: this.code,
        };
    }
}
exports.ZodFriendlyError = ZodFriendlyError;

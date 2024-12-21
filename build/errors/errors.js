"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ZodFriendlyError = exports.ConflictError = exports.UnauthorizedError = exports.InternalServerError = exports.BadRequestError = exports.NotFoundError = exports.CustomError = void 0;
class CustomError extends Error {
    constructor(message, status) {
        super(message);
        this.status = status;
    }
    toString() {
        return {
            status: this.status,
            message: this.message,
        };
    }
}
exports.CustomError = CustomError;
class NotFoundError extends CustomError {
    constructor(message) {
        super(message, 404);
    }
}
exports.NotFoundError = NotFoundError;
class BadRequestError extends CustomError {
    constructor(message) {
        super(message, 400);
    }
}
exports.BadRequestError = BadRequestError;
class InternalServerError extends CustomError {
    constructor(message) {
        super(message, 500);
    }
}
exports.InternalServerError = InternalServerError;
class UnauthorizedError extends CustomError {
    constructor(message) {
        super(message, 401);
    }
}
exports.UnauthorizedError = UnauthorizedError;
class ConflictError extends CustomError {
    constructor(message) {
        super(message, 409);
    }
}
exports.ConflictError = ConflictError;
class ZodFriendlyError extends CustomError {
    constructor(zodError) {
        super("invalid request", 400);
        this.error = zodError;
    }
    toString() {
        return {
            status: this.status,
            message: this.message,
            errors: Object.fromEntries(this.error.errors.map((err) => [err.path.join("."), err.message])),
        };
    }
}
exports.ZodFriendlyError = ZodFriendlyError;

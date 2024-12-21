"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorsMiddleware = void 0;
const bson_1 = require("bson");
const http_status_codes_1 = require("http-status-codes");
const errors_1 = require("../errors/errors");
const errorsMiddleware = (err, req, res, next) => {
    console.error(err.toString());
    if (err instanceof errors_1.CustomError) {
        res.status(err.status).send(err.toString());
    }
    else if (bson_1.BSONError.isBSONError(err)) {
        res.status(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR).send({
            code: http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR,
            message: "Database error",
        });
    }
    else {
        res.status(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR).send({
            status: http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR,
            message: "Internal server error",
        });
    }
};
exports.errorsMiddleware = errorsMiddleware;

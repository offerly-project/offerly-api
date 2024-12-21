"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.queryMiddleware = void 0;
const queryMiddleware = (req, res, next) => {
    Object.entries(req.query).forEach(([key, value]) => {
        if (typeof value === "string")
            req.query[key] = value.replace("and", "&");
    });
    next();
};
exports.queryMiddleware = queryMiddleware;

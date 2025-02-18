"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.queryMiddleware = void 0;
const queryMiddleware = (req, res, next) => {
    if (req.query) {
        const decodedQuery = Object.entries(req.query).reduce((acc, [key, value]) => {
            acc[key] = decodeURIComponent(value);
            return acc;
        }, {});
        req.query = decodedQuery;
    }
    next();
};
exports.queryMiddleware = queryMiddleware;

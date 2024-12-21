"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.uploadsRouter = void 0;
const express_1 = require("express");
const uploads_middleware_1 = require("../middlewares/uploads.middleware");
exports.uploadsRouter = (0, express_1.Router)();
exports.uploadsRouter.post("/images", (0, uploads_middleware_1.imageUploadMiddleware)({
    allowCustomDimensions: true,
    allowedPaths: ["/banks", "/offers", "/cards"],
}));

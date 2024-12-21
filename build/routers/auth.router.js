"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.userAuthRouter = exports.adminAuthRouter = void 0;
const express_1 = require("express");
const http_status_codes_1 = require("http-status-codes");
const auth_controller_1 = require("../controllers/auth.controller");
const auth_middleware_1 = require("../middlewares/auth.middleware");
const utils_1 = require("../utils/utils");
const auth_validators_1 = require("../validators/auth.validators");
exports.adminAuthRouter = (0, express_1.Router)();
exports.adminAuthRouter.post("/login", (0, utils_1.validateRequest)(auth_validators_1.adminLoginSchema), auth_controller_1.authController.adminLoginHandler);
exports.adminAuthRouter.get("/", auth_middleware_1.authorizeAdmin, (req, res) => {
    res.status(http_status_codes_1.StatusCodes.OK).send();
});
exports.userAuthRouter = (0, express_1.Router)();
exports.userAuthRouter.post("/login", (0, utils_1.validateRequest)(auth_validators_1.userLoginSchema), auth_controller_1.authController.userLoginHandler);
exports.userAuthRouter.post("/forgot-password", (0, utils_1.validateRequest)(auth_validators_1.userForgotPasswordSchema), auth_controller_1.authController.userForgotPasswordHandler);
exports.userAuthRouter.put("/reset-password", auth_middleware_1.authorizeUser, (0, utils_1.validateRequest)(auth_validators_1.userResetPasswordSchema), auth_controller_1.authController.userResetPasswordHandler);
exports.adminAuthRouter.get("/", auth_middleware_1.authorizeUser, (req, res) => {
    res.status(http_status_codes_1.StatusCodes.OK).send();
});

"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authController = void 0;
const http_status_codes_1 = require("http-status-codes");
const auth_service_1 = require("../services/auth.service");
const utils_1 = require("../utils/utils");
const adminLoginHandler = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { username, password } = req.body;
    try {
        const { admin, token } = yield auth_service_1.adminAuthService.login(username, password);
        res.status(http_status_codes_1.StatusCodes.OK).send({
            message: "logged in",
            user: admin,
            token,
        });
    }
    catch (e) {
        next(e);
    }
});
const userLoginHandler = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = req.body;
    try {
        const { token, user } = yield auth_service_1.userAuthService.login(email, password);
        res.status(http_status_codes_1.StatusCodes.OK).send({
            message: "logged in",
            user,
            token,
        });
    }
    catch (e) {
        next(e);
    }
});
const userForgotPasswordHandler = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { email } = req.body;
    try {
        const otp = yield auth_service_1.userAuthService.forgotPassword(email);
        res.status(http_status_codes_1.StatusCodes.OK).send({
            message: "Password reset link sent to your email",
            timer: otp.timer,
        });
    }
    catch (e) {
        next(e);
    }
});
const userResetPasswordHandler = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { password } = req.body;
        const id = req.user.id;
        yield auth_service_1.userAuthService.changePassword(id, password);
        const token = yield (0, utils_1.generateToken)(id, "user");
        res.status(http_status_codes_1.StatusCodes.OK).send({
            message: "Password reset successfully",
            token,
        });
    }
    catch (e) {
        next(e);
    }
});
exports.authController = {
    adminLoginHandler,
    userLoginHandler,
    userForgotPasswordHandler,
    userResetPasswordHandler,
};

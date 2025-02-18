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
const errors_1 = require("../errors/errors");
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
const userResetPasswordHandler = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { new_password, old_password } = req.body;
        const { source, id, role } = req.user;
        if (source === "login") {
            if (!old_password) {
                throw new errors_1.BadRequestError("Old password is required for this action");
            }
            yield auth_service_1.userAuthService.changePasswordWithOldPassword(id, old_password, new_password);
        }
        else if (source === "password-reset") {
            if (old_password) {
                throw new errors_1.BadRequestError("Old password should not be provided for this action");
            }
            yield auth_service_1.userAuthService.changePassword(id, new_password);
        }
        else {
            throw new errors_1.UnauthorizedError("You do not have permission to reset the password");
        }
        const token = yield (0, utils_1.generateToken)(id, role, "login");
        res.status(http_status_codes_1.StatusCodes.OK).send({
            message: "Password reset successfully",
            token,
        });
    }
    catch (e) {
        next(e);
    }
});
const userLogoutHandler = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.user;
        yield auth_service_1.userAuthService.logout(id);
        res.status(http_status_codes_1.StatusCodes.OK).send({
            message: "logged out",
        });
    }
    catch (e) {
        next(e);
    }
});
exports.authController = {
    adminLoginHandler,
    userLoginHandler,
    userResetPasswordHandler,
    userLogoutHandler,
};

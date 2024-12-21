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
exports.otpController = void 0;
const http_status_codes_1 = require("http-status-codes");
const errors_1 = require("../errors/errors");
const admins_repository_1 = require("../repositories/admins.repository");
const users_repository_1 = require("../repositories/users.repository");
const otp_service_1 = require("../services/otp.service");
const utils_1 = require("../utils/utils");
const verifyOtpHandler = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { otp, email } = req.body;
        const role = req.user.role;
        const userHasOtp = otp_service_1.otpService.hasOtp(email);
        if (!userHasOtp) {
            throw new errors_1.NotFoundError("OTP not found");
        }
        const otpValid = otp_service_1.otpService.verifyOtp(email, otp);
        if (!otpValid) {
            throw new errors_1.BadRequestError("Invalid OTP");
        }
        const document = role === "admin"
            ? yield admins_repository_1.adminsRepository.findOneByUsername(email)
            : yield users_repository_1.usersRepository.findByEmail(email);
        if (!document) {
            throw new errors_1.NotFoundError("User not found");
        }
        const token = yield (0, utils_1.generateToken)(document === null || document === void 0 ? void 0 : document._id.toString(), role, {
            expiresIn: "5m",
        });
        res.status(http_status_codes_1.StatusCodes.OK).json({ message: "OTP verified", token });
    }
    catch (e) {
        next(e);
    }
});
exports.otpController = { verifyOtpHandler };

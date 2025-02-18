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
const errors_codes_1 = require("../errors/errors.codes");
const users_repository_1 = require("../repositories/users.repository");
const mail_service_1 = require("../services/mail.service");
const otp_service_1 = require("../services/otp.service");
const utils_1 = require("../utils/utils");
const verifyUserOtpHandler = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { otp, email } = req.body;
        const userHasOtp = otp_service_1.otpService.hasOtp(email);
        if (!userHasOtp) {
            throw new errors_1.NotFoundError("OTP not found", errors_codes_1.ErrorCodes.OTP_NOT_FOUND);
        }
        const otpData = otp_service_1.otpService.getOtp(email);
        const otpValid = yield otp_service_1.otpService.verifyOtp(email, otp);
        if (!otpValid) {
            throw new errors_1.BadRequestError("Invalid OTP", errors_codes_1.ErrorCodes.INVALID_OTP);
        }
        const document = yield users_repository_1.usersRepository.findByEmail(email);
        if (!document) {
            throw new errors_1.NotFoundError("User not found", errors_codes_1.ErrorCodes.NOT_FOUND);
        }
        const token = yield (0, utils_1.generateToken)(document === null || document === void 0 ? void 0 : document._id.toString(), "user", otpData.source, {
            expiresIn: "5m",
        });
        res.status(http_status_codes_1.StatusCodes.OK).json({ message: "OTP verified", token });
    }
    catch (e) {
        next(e);
    }
});
const generateUserOtpHandler = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    let { email, source } = req.body;
    email = email.toLowerCase();
    try {
        if (source === "login") {
            throw new errors_1.UnauthorizedError("Can't generate OTP of this type", errors_codes_1.ErrorCodes.UNAUTHORIZED);
        }
        const otp = yield otp_service_1.otpService.requestOtp(email, source);
        const user = yield users_repository_1.usersRepository.findByEmail(email);
        if (!user) {
            throw new errors_1.NotFoundError("User not found", errors_codes_1.ErrorCodes.NOT_FOUND);
        }
        mail_service_1.mailService.sendOtpMail(email, user === null || user === void 0 ? void 0 : user.full_name, otp.code, user.language);
        res.status(http_status_codes_1.StatusCodes.OK).send({
            status: http_status_codes_1.StatusCodes.OK,
            message: "OTP sent to your email",
            expiry: otp.expiry,
        });
    }
    catch (e) {
        next(e);
    }
});
exports.otpController = { verifyUserOtpHandler, generateUserOtpHandler };

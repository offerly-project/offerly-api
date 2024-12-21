"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.otpRouter = void 0;
const express_1 = require("express");
const otp_controller_1 = require("../controllers/otp.controller");
const utils_1 = require("../utils/utils");
const otp_validators_1 = require("../validators/otp.validators");
exports.otpRouter = (0, express_1.Router)();
exports.otpRouter.post("/verify", (0, utils_1.validateRequest)(otp_validators_1.otpVerificationSchema), otp_controller_1.otpController.verifyOtpHandler);

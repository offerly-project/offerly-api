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
exports.otpService = exports.OTPService = void 0;
const errors_1 = require("../errors/errors");
const otp_model_1 = require("../models/otp.model");
class OTPService {
    constructor() {
        this._otps = {};
        this.requestOtp = (email, source) => {
            const otpInstance = this._otps[email];
            if (otpInstance) {
                if (otpInstance.canRequest()) {
                    return otpInstance.init();
                }
                else {
                    throw new errors_1.BadRequestError(`Please wait for ${otp_model_1.OTP_SECONDS_BUFFER} seconds before requesting another OTP`);
                }
            }
            else {
                this._otps[email] = new otp_model_1.OTP(source);
                return this._otps[email].init();
            }
        };
        this.hasOtp = (email) => {
            return !!this._otps[email];
        };
        this.verifyOtp = (email, code) => __awaiter(this, void 0, void 0, function* () {
            const otpInstance = this._otps[email];
            if (!otpInstance) {
                return false;
            }
            const verified = yield otpInstance.verify(code);
            if (verified) {
                delete this._otps[email];
            }
            return verified;
        });
        this.getOtp = (email) => {
            return this._otps[email];
        };
        this.shouldCleanup = () => {
            return Object.values(this._otps).every((otp) => otp.isExpired());
        };
        this.reset = () => {
            Object.values(this._otps).forEach((otp) => otp.clearTimeouts());
            this._otps = {};
        };
    }
}
exports.OTPService = OTPService;
exports.otpService = new OTPService();

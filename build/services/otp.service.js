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
const otp_model_1 = require("../models/otp.model");
class OTPService {
    constructor() {
        this.otps = {};
        this.hasOtp = (email) => {
            return !!this.otps[email];
        };
        this.sendOtp = (email) => {
            if (this.otps[email]) {
                if (this.otps[email].requestable) {
                    this.otps[email].requestOtp();
                    return {
                        code: this.otps[email].code,
                        timer: this.otps[email].requestTimer,
                    };
                }
                else {
                    return {
                        code: null,
                        timer: this.otps[email].requestTimer,
                    };
                }
            }
            else {
                this.otps[email] = new otp_model_1.OTP();
                this.otps[email].requestOtp();
                setTimeout(() => {
                    this.deleteOtp(email);
                }, 75 * 60 * 1000);
                return {
                    code: this.otps[email].code,
                    timer: this.otps[email].requestTimer,
                };
            }
        };
        this.verifyOtp = (email, otp) => {
            const userOtp = this.otps[email];
            if (!userOtp) {
                return false;
            }
            const verified = userOtp.validateOtp(otp);
            return verified;
        };
        this.deleteOtp = (email) => __awaiter(this, void 0, void 0, function* () {
            delete this.otps[email];
        });
    }
}
exports.OTPService = OTPService;
exports.otpService = new OTPService();

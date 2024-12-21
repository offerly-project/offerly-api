"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OTP = void 0;
const crypto_1 = require("crypto");
class OTP {
    validateOtp(otp) {
        const valid = this.code === otp && this.usable;
        if (valid)
            this.setToUnusable();
        return valid;
    }
    constructor() {
        this.intervals = [1, 5, 15, 30, 60].map((minutes) => minutes * 60 * 1000);
        this._generateOtp = (length = 4) => {
            const otpArray = (0, crypto_1.randomBytes)(length);
            return Array.from(otpArray, (num) => num % 10).join("");
        };
        this.requestNumber = 0;
        this.requestable = true;
        this.usable = true;
    }
    setToUnusable() {
        this.usable = false;
    }
    canRequest() {
        return this.requestNumber < this.intervals.length;
    }
    startTimer() {
        const timer = this.intervals[this.requestNumber];
        this.requestTimer = timer;
        this.requestable = false;
        setTimeout(() => {
            this.requestable = true;
            this.requestNumber++;
        }, timer);
    }
    requestOtp() {
        if (!this.canRequest())
            throw new Error("Maximum OTP requests reached");
        const otp = this._generateOtp();
        this.code = otp;
        this.startTimer();
        return otp;
    }
}
exports.OTP = OTP;

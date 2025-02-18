"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OTP = exports.OTP_LENGTH = exports.OTP_SECONDS_BUFFER = exports.OTP_BUFFER = exports.OTP_REREQUEST = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const crypto_1 = require("crypto");
const env_1 = require("../configs/env");
// 30 seconds
exports.OTP_REREQUEST = 0.5 * (60 * 1000);
// 30 minutes
exports.OTP_BUFFER = 30 * 60 * 1000;
exports.OTP_SECONDS_BUFFER = exports.OTP_REREQUEST / 1000;
exports.OTP_LENGTH = 4;
class OTP {
    constructor(source) {
        this._code = null;
        this._pending = true;
        this.source = "login";
        this._timeouts = [];
        this._generateOtp = () => {
            const otpArray = (0, crypto_1.randomBytes)(exports.OTP_LENGTH);
            return Array.from(otpArray, (num) => num % 10).join("");
        };
        this.clearTimeouts = () => {
            this._timeouts.forEach((timeout) => {
                clearTimeout(timeout);
            });
            this._timeouts = [];
        };
        this._startTimer = () => {
            this._timeouts.push(setTimeout(() => {
                this._pending = false;
            }, exports.OTP_REREQUEST), setTimeout(() => {
                this._code = null;
            }, exports.OTP_BUFFER));
        };
        this.init = () => {
            this._pending = true;
            return new Promise((resolve, reject) => {
                const otpGenerated = this._generateOtp();
                bcrypt_1.default.hash(otpGenerated, +env_1.env.SALT_ROUNDS, (err, hash) => {
                    if (err) {
                        reject(err);
                    }
                    this._code = hash;
                    this.clearTimeouts();
                    this._startTimer();
                    resolve({ code: otpGenerated, expiry: exports.OTP_SECONDS_BUFFER });
                });
            });
        };
        this.canRequest = () => {
            return !this._pending;
        };
        this.verify = (code) => {
            return new Promise((resolve, reject) => {
                if (!this._code) {
                    resolve(false);
                    return;
                }
                bcrypt_1.default.compare(code, this._code, (err, same) => {
                    if (err) {
                        reject(err);
                    }
                    resolve(same);
                });
            });
        };
        this.isExpired = () => {
            return this._code === null;
        };
        this.source = source;
    }
}
exports.OTP = OTP;

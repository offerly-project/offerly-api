"use strict";
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.startGarbageCollectors = exports.OTPGarbageCollector = void 0;
const otp_service_1 = require("../services/otp.service");
class OTPGarbageCollector {
}
exports.OTPGarbageCollector = OTPGarbageCollector;
_a = OTPGarbageCollector;
OTPGarbageCollector._interval = 1 * 60 * 60 * 1000; // 1 Hours
OTPGarbageCollector.start = () => {
    setInterval(() => {
        if (otp_service_1.otpService.shouldCleanup()) {
            otp_service_1.otpService.reset();
        }
    }, _a._interval);
};
const startGarbageCollectors = () => {
    OTPGarbageCollector.start();
};
exports.startGarbageCollectors = startGarbageCollectors;

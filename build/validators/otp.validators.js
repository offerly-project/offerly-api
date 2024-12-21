"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.otpVerificationSchema = void 0;
const zod_1 = require("zod");
exports.otpVerificationSchema = zod_1.z.object({
    body: zod_1.z.object({
        otp: zod_1.z.string().length(4),
        email: zod_1.z.string(),
    }),
});

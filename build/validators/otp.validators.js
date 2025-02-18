"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.otpGenerationSchema = exports.otpVerificationSchema = void 0;
const zod_1 = require("zod");
const utils_1 = require("../utils/utils");
exports.otpVerificationSchema = zod_1.z.object({
    body: zod_1.z.object({
        otp: zod_1.z.string().length(4),
        email: zod_1.z.string(),
    }),
});
exports.otpGenerationSchema = zod_1.z.object({
    body: zod_1.z.object({
        email: zod_1.z.string(),
        source: zod_1.z.enum(utils_1.jwtSources),
    }),
});

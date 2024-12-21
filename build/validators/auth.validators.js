"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.userResetPasswordSchema = exports.userForgotPasswordSchema = exports.userLoginSchema = exports.adminLoginSchema = void 0;
const zod_1 = require("zod");
exports.adminLoginSchema = zod_1.z.object({
    body: zod_1.z.object({
        username: zod_1.z.string({ message: "Username is required" }),
        password: zod_1.z.string({ message: "Password is required" }),
    }),
});
exports.userLoginSchema = zod_1.z.object({
    body: zod_1.z.object({
        email: zod_1.z.string({ message: "Email is required" }),
        password: zod_1.z.string({ message: "Password is required" }),
    }),
});
exports.userForgotPasswordSchema = zod_1.z.object({
    body: zod_1.z.object({
        email: zod_1.z.string({ message: "Email is required" }),
    }),
});
exports.userResetPasswordSchema = zod_1.z.object({
    body: zod_1.z.object({
        password: zod_1.z.string({ message: "Password is required" }),
    }),
});

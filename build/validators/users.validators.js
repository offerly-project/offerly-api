"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.signupUserSchema = void 0;
const zod_1 = require("zod");
exports.signupUserSchema = zod_1.z.object({
    body: zod_1.z.object({
        email: zod_1.z.string({ message: "Email is required" }),
        password: zod_1.z.string({ message: "Password is required" }),
        full_name: zod_1.z.string({ message: "Full Name is required" }),
    }),
});

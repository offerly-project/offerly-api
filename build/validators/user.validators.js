"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.guestContactSchema = exports.userContactSchema = exports.patchUserSchema = exports.signupUserSchema = void 0;
const zod_1 = require("zod");
const user_model_1 = require("../models/user.model");
const notificationTokenSchema = zod_1.z.object({
    token: zod_1.z.string(),
    timestamp: zod_1.z.number(),
    platform: zod_1.z.string(),
});
exports.signupUserSchema = zod_1.z.object({
    body: zod_1.z.object({
        email: zod_1.z.string({ message: "Email is required" }),
        password: zod_1.z.string({ message: "Password is required" }),
        full_name: zod_1.z.string({ message: "Full Name is required" }),
        language: zod_1.z.enum(user_model_1.LANGUAGES).default("en"),
    }),
});
exports.patchUserSchema = zod_1.z.object({
    body: zod_1.z.object({
        full_name: zod_1.z.string().optional(),
        phone_number: zod_1.z.string().optional(),
        language: zod_1.z.enum(user_model_1.LANGUAGES).optional(),
        notification_token: notificationTokenSchema.optional(),
    }),
});
exports.userContactSchema = zod_1.z.object({
    body: zod_1.z.object({
        subject: zod_1.z.string({ message: "Subject is required" }),
        message: zod_1.z.string({ message: "Message is required" }),
    }),
});
exports.guestContactSchema = zod_1.z.object({
    body: zod_1.z.object({
        email: zod_1.z.string({ message: "Email is required" }),
        subject: zod_1.z.string({ message: "Subject is required" }),
        message: zod_1.z.string({ message: "Message is required" }),
    }),
});

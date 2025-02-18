"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateBankSchema = exports.createBankSchema = void 0;
const zod_1 = require("zod");
const constants_1 = require("../constants");
const data_validators_1 = require("./data.validators");
exports.createBankSchema = zod_1.z.object({
    body: zod_1.z.object({
        country: zod_1.z.string({ message: "Country is required" }),
        type: zod_1.z.enum(["regular", "digital", "digital-wallet"], {
            message: "Type should be regular, digital, or digital-wallet",
        }),
        name: data_validators_1.languagesSchema,
        logo: zod_1.z.string({ message: "Logo is required" }).optional(),
    }),
});
exports.updateBankSchema = zod_1.z.object({
    body: zod_1.z.object({
        country: zod_1.z.string().optional(),
        type: zod_1.z
            .enum(["regular", "digital", "digital-wallet"], {
            message: "Type should be regular, digital, or digital-wallet",
        })
            .optional(),
        name: data_validators_1.languagesSchema.optional(),
        logo: zod_1.z.string({ message: "Logo is required" }).optional(),
        status: zod_1.z.enum(constants_1.entityStatuses).optional(),
        cards: zod_1.z.array(zod_1.z.string()).optional(),
    }),
});

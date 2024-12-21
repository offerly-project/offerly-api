"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteCardSchema = exports.patchUserCardsschema = exports.updateCardSchema = exports.createCardSchema = void 0;
const zod_1 = require("zod");
const constants_1 = require("../constants");
const data_validators_1 = require("./data.validators");
exports.createCardSchema = zod_1.z.object({
    body: zod_1.z.object({
        bank: zod_1.z.string({ message: "Card Bank is required" }),
        name: data_validators_1.languagesSchema,
        logo: zod_1.z.string({ message: "Card Logo is required" }).optional(),
        grade: data_validators_1.languagesSchema,
        scheme: data_validators_1.languagesSchema,
    }),
});
exports.updateCardSchema = zod_1.z.object({
    body: zod_1.z.object({
        bank: zod_1.z.string().optional(),
        name: data_validators_1.languagesSchema.optional(),
        logo: zod_1.z.string().optional(),
        grade: data_validators_1.languagesSchema.optional(),
        scheme: data_validators_1.languagesSchema.optional(),
        status: zod_1.z.enum(constants_1.entityStatuses).optional(),
        offers: zod_1.z.array(zod_1.z.string()).optional(),
    }),
});
exports.patchUserCardsschema = zod_1.z.object({
    body: zod_1.z.object({
        cards: zod_1.z.array(zod_1.z.string({ message: "Card ID is required" })),
    }),
});
exports.deleteCardSchema = zod_1.z.object({
    query: zod_1.z.object({
        cards: (0, data_validators_1.commaSeparatedStringSchema)("card ids should be separated by commas"),
    }),
});

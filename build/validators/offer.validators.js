"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUserOffersSchema = exports.updateOfferSchema = exports.createOfferSchema = void 0;
const lodash_1 = require("lodash");
const zod_1 = require("zod");
const constants_1 = require("../constants");
const data_validators_1 = require("./data.validators");
exports.createOfferSchema = zod_1.z.object({
    body: zod_1.z.object({
        description: data_validators_1.languagesSchema,
        terms_and_conditions: data_validators_1.languagesSchema,
        offer_source_link: zod_1.z.string({ message: "Offer source link is required" }),
        logo: zod_1.z.string().optional(),
        discount_code: zod_1.z.string().optional(),
        starting_date: zod_1.z.coerce.date().optional(),
        expiry_date: zod_1.z.string(),
        minimum_amount: zod_1.z
            .number({ message: "Minimum amount is required" })
            .optional(),
        cap: zod_1.z.number().optional(),
        channels: zod_1.z.array(zod_1.z.enum(constants_1.channels)),
        categories: zod_1.z
            .array(zod_1.z.string({ message: "Categories are required" }))
            .refine((0, data_validators_1.validateCategories)()),
        applicable_cards: zod_1.z.array(zod_1.z.string({ message: "Cards are required" })),
        title: data_validators_1.languagesSchema,
    }),
});
exports.updateOfferSchema = zod_1.z.object({
    body: zod_1.z.object({
        description: data_validators_1.languagesSchema.optional(),
        terms_and_conditions: data_validators_1.languagesSchema.optional(),
        offer_source_link: zod_1.z
            .string({ message: "Offer source link is required" })
            .optional(),
        logo: zod_1.z.string().optional(),
        discount_code: zod_1.z.string().optional(),
        starting_date: zod_1.z.coerce.date().optional(),
        expiry_date: zod_1.z.string().optional(),
        minimum_amount: zod_1.z
            .number({ message: "Minimum amount is required" })
            .optional(),
        cap: zod_1.z.number().optional(),
        channels: zod_1.z.enum(constants_1.channels).optional(),
        categories: zod_1.z
            .array(zod_1.z.string({ message: "Categories are required" }))
            .refine((0, data_validators_1.validateCategories)()),
        applicable_cards: zod_1.z
            .array(zod_1.z.string({ message: "Card IDs are required" }))
            .optional(),
        status: zod_1.z.enum(constants_1.entityStatuses).optional(),
        title: data_validators_1.languagesSchema.optional(),
    }),
});
exports.getUserOffersSchema = zod_1.z.object({
    query: zod_1.z.object({
        card: zod_1.z.string(),
        q: zod_1.z.string().optional(),
        category: zod_1.z.string().optional().refine((0, data_validators_1.validateCategories)(true)),
        page: zod_1.z.string().refine((value) => {
            if (!(0, lodash_1.isNumber)(+value)) {
                return false;
            }
            return +value >= 1;
        }),
        limit: zod_1.z.string().refine((value) => {
            if (!(0, lodash_1.isNumber)(+value)) {
                return false;
            }
            return +value <= 20 && +value >= 1;
        }),
    }),
});

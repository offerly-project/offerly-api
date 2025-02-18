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
        offer_source_link: zod_1.z.string(),
        logo: zod_1.z.string().optional(),
        discount_code: zod_1.z.string().optional(),
        starting_date: zod_1.z.coerce.date().optional(),
        expiry_date: zod_1.z.coerce.date(),
        minimum_amount: zod_1.z.string().optional(),
        cap: zod_1.z.string().optional(),
        channels: zod_1.z.array(zod_1.z.enum(constants_1.channels)),
        categories: zod_1.z.array(zod_1.z.string()),
        applicable_cards: zod_1.z.array(zod_1.z.string()).min(1),
        title: data_validators_1.languagesSchema,
    }),
});
exports.updateOfferSchema = zod_1.z.object({
    body: zod_1.z.object({
        description: data_validators_1.languagesSchema.optional(),
        terms_and_conditions: data_validators_1.languagesSchema.optional(),
        offer_source_link: zod_1.z.string().optional(),
        logo: zod_1.z.string().optional(),
        discount_code: zod_1.z.string().optional(),
        starting_date: zod_1.z.coerce.date().optional(),
        expiry_date: zod_1.z.coerce.date().optional(),
        minimum_amount: zod_1.z.string().optional(),
        cap: zod_1.z.string().optional(),
        channels: zod_1.z.array(zod_1.z.enum(constants_1.channels)).optional(),
        categories: zod_1.z.array(zod_1.z.string()).optional(),
        applicable_cards: zod_1.z.array(zod_1.z.string()).min(1),
        status: zod_1.z.enum(constants_1.entityStatuses).optional(),
        title: data_validators_1.languagesSchema.optional(),
    }),
});
const offerSortBySchema = zod_1.z.enum([
    "expiry_date",
    "alphabet_ar",
    "alphabet_en",
    "created_at",
]);
const offerSortDirectionSchema = zod_1.z.enum(["asc", "desc"]);
exports.getUserOffersSchema = zod_1.z.object({
    query: zod_1.z.object({
        card: zod_1.z.string().optional(),
        q: zod_1.z.string().optional(),
        bank: zod_1.z.string().optional(),
        sort_by: offerSortBySchema.optional(),
        sort_direction: offerSortDirectionSchema.default("asc").optional(),
        category: zod_1.z.string().optional(),
        page: zod_1.z
            .string()
            .refine((value) => {
            if (!(0, lodash_1.isNumber)(+value)) {
                return true;
            }
            return +value >= 1;
        })
            .optional(),
        limit: zod_1.z
            .string()
            .refine((value) => {
            if (!(0, lodash_1.isNumber)(+value)) {
                return true;
            }
            return +value <= 50 && +value >= 1;
        })
            .optional(),
    }),
});

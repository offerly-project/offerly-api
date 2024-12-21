"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteUserFavoriteOffersSchema = exports.patchUserFavoriteOffersSchema = void 0;
const zod_1 = require("zod");
const data_validators_1 = require("./data.validators");
exports.patchUserFavoriteOffersSchema = zod_1.z.object({
    body: zod_1.z.object({
        offers: zod_1.z.array(zod_1.z.string()),
    }),
});
exports.deleteUserFavoriteOffersSchema = zod_1.z.object({
    query: zod_1.z.object({
        offers: (0, data_validators_1.commaSeparatedStringSchema)("offer ids should be separated by commas"),
    }),
});

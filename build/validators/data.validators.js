"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.commaSeparatedStringSchema = exports.languagesSchema = void 0;
const lodash_1 = require("lodash");
const zod_1 = require("zod");
exports.languagesSchema = zod_1.z.object({
    en: zod_1.z.string({ message: "English is required" }).min(1),
    ar: zod_1.z.string({ message: "Arabic is required" }).min(1),
});
const commaSeparatedStringSchema = (message) => zod_1.z.string({ message }).refine((value) => {
    const values = value.split(",");
    const allNumbers = values.every((val) => (0, lodash_1.isNumber)(Number(val)));
    return allNumbers;
}, {
    message,
});
exports.commaSeparatedStringSchema = commaSeparatedStringSchema;

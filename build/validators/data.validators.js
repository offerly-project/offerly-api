"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.commaSeparatedStringSchema = exports.languagesSchema = exports.validateCategories = exports.validateCountries = void 0;
const lodash_1 = require("lodash");
const zod_1 = require("zod");
const constants_service_1 = require("../services/constants.service");
const validateCountries = (countries) => __awaiter(void 0, void 0, void 0, function* () {
    const COUNTRIES = yield constants_service_1.ConstantsService.getCountries();
    if (typeof countries === "string") {
        return COUNTRIES.includes(countries);
    }
    return countries.every((country) => {
        return COUNTRIES.includes(country);
    });
});
exports.validateCountries = validateCountries;
const validateCategories = (optional = false) => (categories) => __awaiter(void 0, void 0, void 0, function* () {
    console.log(categories, optional);
    if (!categories && optional)
        return true;
    const CATEGORIES = yield constants_service_1.ConstantsService.getCategories();
    console.log(categories, CATEGORIES);
    if (typeof categories === "string") {
        return CATEGORIES.includes(categories);
    }
    return categories === null || categories === void 0 ? void 0 : categories.every((category) => {
        return CATEGORIES.includes(category);
    });
});
exports.validateCategories = validateCategories;
exports.languagesSchema = zod_1.z.object({
    en: zod_1.z.string({ message: "English  is required" }).min(1),
    ar: zod_1.z.string({ message: "Arabic  is required" }).min(1),
});
const commaSeparatedStringSchema = (message) => zod_1.z.string({ message: "Card ID is required" }).refine((value) => {
    const values = value.split(",");
    const allNumbers = values.every((val) => (0, lodash_1.isNumber)(Number(val)));
    return allNumbers;
}, {
    message,
});
exports.commaSeparatedStringSchema = commaSeparatedStringSchema;

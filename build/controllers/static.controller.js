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
exports.staticController = void 0;
const categories_repository_1 = require("../repositories/categories.repository");
const countries_repository_1 = require("../repositories/countries.repository");
const languages_repository_1 = require("../repositories/languages.repository");
const utils_1 = require("../utils/utils");
const getCountriesHandler = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const countries = yield countries_repository_1.countriesRepository.getCountries();
        res.json((0, utils_1.transformDocsResponse)(countries));
    }
    catch (e) {
        next(e);
    }
});
const getLanguagesHandler = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const languages = yield languages_repository_1.languagesRepository.getLanguages();
        res.json((0, utils_1.transformDocsResponse)(languages));
    }
    catch (e) {
        next(e);
    }
});
const getCategoriesHandler = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const categories = yield categories_repository_1.categoriesRepository.getCategories();
        res.json((0, utils_1.transformDocsResponse)(categories));
    }
    catch (e) {
        next(e);
    }
});
exports.staticController = {
    getCountriesHandler,
    getLanguagesHandler,
    getCategoriesHandler,
};

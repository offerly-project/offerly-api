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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ConstantsService = void 0;
const fs_1 = __importDefault(require("fs"));
const env_1 = require("../configs/env");
class ConstantsService {
    static getCategories() {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => {
                fs_1.default.readFile(env_1.env.DATA_DIR + "/categories.json", "utf-8", (err, data) => {
                    if (err) {
                        reject(err);
                    }
                    return resolve(JSON.parse(data));
                });
            });
        });
    }
    static getCountries() {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => {
                fs_1.default.readFile(env_1.env.DATA_DIR + "/countries.json", "utf-8", (err, data) => {
                    if (err) {
                        reject(err);
                    }
                    return resolve(JSON.parse(data));
                });
            });
        });
    }
    static getLanguages() {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => {
                fs_1.default.readFile(env_1.env.DATA_DIR + "/languages.json", "utf-8", (err, data) => {
                    if (err) {
                        reject(err);
                    }
                    return resolve(JSON.parse(data));
                });
            });
        });
    }
}
exports.ConstantsService = ConstantsService;

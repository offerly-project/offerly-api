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
exports.languagesRepository = exports.LanguagesRepository = void 0;
const db_1 = require("../configs/db");
class LanguagesRepository {
    constructor(db) {
        this.collection = db.getCollection("languages");
    }
    getLanguages() {
        return __awaiter(this, void 0, void 0, function* () {
            return this.collection
                .aggregate([
                {
                    $project: {
                        _id: 0,
                    },
                },
            ])
                .toArray();
        });
    }
}
exports.LanguagesRepository = LanguagesRepository;
exports.languagesRepository = new LanguagesRepository(db_1.db);

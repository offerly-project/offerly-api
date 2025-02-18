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
exports.categoriesRepository = exports.CategoriesRepository = void 0;
const db_1 = require("../configs/db");
class CategoriesRepository {
    constructor(db) {
        this.collection = db.getCollection("categories");
    }
    getCategories() {
        return __awaiter(this, void 0, void 0, function* () {
            return this.collection.aggregate().toArray();
        });
    }
    categoriesExists(ids) {
        return __awaiter(this, void 0, void 0, function* () {
            const categories = yield this.collection
                .find({ _id: { $in: ids } })
                .toArray();
            return categories.length === ids.length;
        });
    }
}
exports.CategoriesRepository = CategoriesRepository;
exports.categoriesRepository = new CategoriesRepository(db_1.db);

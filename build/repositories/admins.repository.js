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
exports.adminsRepository = exports.AdminsRepository = void 0;
const db_1 = require("../configs/db");
class AdminsRepository {
    constructor() {
        this.collection = db_1.db.getCollection("admins");
    }
    findByEmail(email) {
        return __awaiter(this, void 0, void 0, function* () {
            const admin = yield this.collection.findOne({
                email,
            });
            return admin;
        });
    }
    findOneByUsername(username) {
        return __awaiter(this, void 0, void 0, function* () {
            const admin = yield this.collection.findOne({
                username,
            });
            return admin;
        });
    }
}
exports.AdminsRepository = AdminsRepository;
exports.adminsRepository = new AdminsRepository();

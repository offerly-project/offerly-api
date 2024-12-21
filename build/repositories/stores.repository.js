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
exports.storesRepository = exports.StoresRepository = void 0;
const mongodb_1 = require("mongodb");
const db_1 = require("../configs/db");
const errors_1 = require("../errors/errors");
// NON-MVP CODE
class StoresRepository {
    constructor() {
        this.collection = db_1.db.getCollection("stores");
    }
    findById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const store = yield this.collection.findOne({ _id: new mongodb_1.ObjectId(id) });
            return store ? store : null;
        });
    }
    getAll() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.collection.find().toArray();
        });
    }
    storeNameExists(name) {
        return __awaiter(this, void 0, void 0, function* () {
            return (yield this.collection.findOne({ name })) !== null;
        });
    }
    findByName(name) {
        return __awaiter(this, void 0, void 0, function* () {
            const store = yield this.collection.findOne({ name });
            return store ? store : null;
        });
    }
    add(store) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield this.collection.insertOne(store);
            if (!result.insertedId) {
                throw new errors_1.InternalServerError("Failed to create store");
            }
            return result.insertedId;
        });
    }
    update(id, store) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield this.collection.updateOne({ _id: new mongodb_1.ObjectId(id) }, { $set: store });
            if (!result.matchedCount) {
                throw new errors_1.InternalServerError("Failed to update store");
            }
        });
    }
}
exports.StoresRepository = StoresRepository;
exports.storesRepository = new StoresRepository();

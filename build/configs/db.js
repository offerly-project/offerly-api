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
exports.db = exports.Database = void 0;
const mongodb_1 = require("mongodb");
const env_1 = require("./env");
class Database {
    constructor() {
        console.log(env_1.env.DB_URL);
        this._client = new mongodb_1.MongoClient(env_1.env.DB_URL);
    }
    connect() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield this._client.connect();
            }
            catch (e) {
                throw e;
            }
        });
    }
    disconnect() {
        return __awaiter(this, void 0, void 0, function* () {
            this._client.close();
        });
    }
    get db() {
        return this._client.db("offerly");
    }
    getCollection(name) {
        return this.db.collection(name);
    }
}
exports.Database = Database;
exports.db = new Database();

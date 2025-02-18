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
exports.banksRepository = exports.BanksRepository = void 0;
const mongodb_1 = require("mongodb");
const db_1 = require("../configs/db");
const errors_1 = require("../errors/errors");
const errors_codes_1 = require("../errors/errors.codes");
const utils_1 = require("../utils/utils");
class BanksRepository {
    constructor() {
        this._basePipeline = [
            {
                $lookup: {
                    from: "cards",
                    localField: "cards",
                    foreignField: "_id",
                    as: "cards",
                },
            },
        ];
        this._bankCardsPipeline = [
            {
                $match: {
                    status: { $eq: "enabled" },
                },
            },
            {
                $lookup: {
                    from: "cards",
                    localField: "cards",
                    foreignField: "_id",
                    as: "cards",
                },
            },
            {
                $lookup: {
                    from: "banks",
                    localField: "_id",
                    foreignField: "_id",
                    as: "bank",
                },
            },
            {
                $unwind: "$bank",
            },
            {
                $project: {
                    _id: 0,
                    bank: {
                        name: "$bank.name",
                        logo: "$bank.logo",
                        country: "$bank.country",
                        type: "$bank.type",
                        status: "$bank.status",
                        _id: "$bank._id",
                    },
                    cards: 1,
                },
            },
            {
                $project: {
                    cards: {
                        bank: 0,
                        offers: 0,
                    },
                },
            },
        ];
        this._userBanksPipeline = [
            {
                $match: {
                    status: { $eq: "enabled" },
                },
            },
            {
                $project: {
                    name: 1,
                    logo: 1,
                    type: 1,
                    country: 1,
                    status: 1,
                    _id: 1,
                },
            },
            {
                $project: {
                    cards: 0,
                },
            },
        ];
        this.collection = db_1.db.getCollection("banks");
    }
    bankNameExists(name) {
        return __awaiter(this, void 0, void 0, function* () {
            return ((yield this.collection.findOne((0, utils_1.languageSearchQuery)("name", name))) !==
                null);
        });
    }
    findByName(name) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.collection.findOne((0, utils_1.languageSearchQuery)("name", name));
        });
    }
    getBankCardsIds(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const bank = yield this.collection.findOne({ _id: new mongodb_1.ObjectId(id) });
            if (!bank) {
                throw new errors_1.NotFoundError("Bank not found", errors_codes_1.ErrorCodes.BANK_NOT_FOUND);
            }
            return bank.cards;
        });
    }
    findById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const bank = yield this.collection
                .aggregate([
                {
                    $match: {
                        _id: new mongodb_1.ObjectId(id),
                    },
                },
                ...this._basePipeline,
            ])
                .toArray()
                .then((result) => result[0]);
            if (!bank) {
                throw new errors_1.NotFoundError("Bank not found", errors_codes_1.ErrorCodes.BANK_NOT_FOUND);
            }
            return bank;
        });
    }
    add(bank) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield this.collection.insertOne(bank);
            if (!result.insertedId) {
                throw new errors_1.InternalServerError("Failed to create bank", errors_codes_1.ErrorCodes.CREATE_BANK_FAILED);
            }
            return result.insertedId;
        });
    }
    update(id, bank) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield this.collection.updateOne({ _id: new mongodb_1.ObjectId(id) }, { $set: bank });
            if (!result.acknowledged) {
                throw new errors_1.InternalServerError("Failed to update bank", errors_codes_1.ErrorCodes.UPDATE_BANK_FAILED);
            }
        });
    }
    getUserBanks() {
        return __awaiter(this, void 0, void 0, function* () {
            return this.collection
                .aggregate(this._userBanksPipeline)
                .toArray();
        });
    }
    getAll() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.collection
                .aggregate([...this._basePipeline])
                .toArray();
        });
    }
    getCardsByBankId(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const docs = yield this.collection
                .aggregate([
                {
                    $match: {
                        _id: new mongodb_1.ObjectId(id),
                    },
                },
                ...this._bankCardsPipeline,
            ])
                .toArray();
            return docs[0];
        });
    }
}
exports.BanksRepository = BanksRepository;
exports.banksRepository = new BanksRepository();

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
exports.cardsRepository = exports.CardsRepository = void 0;
const mongodb_1 = require("mongodb");
const db_1 = require("../configs/db");
const errors_1 = require("../errors/errors");
const errors_codes_1 = require("../errors/errors.codes");
const utils_1 = require("../utils/utils");
class CardsRepository {
    constructor() {
        this._basePipeline = [
            {
                $lookup: {
                    from: "banks",
                    localField: "bank",
                    foreignField: "_id",
                    as: "bank",
                },
            },
            {
                $unwind: "$bank",
            },
            {
                $lookup: {
                    from: "offers",
                    localField: "offers",
                    foreignField: "_id",
                    as: "offers",
                },
            },
        ];
        this._userCardsPipeline = [
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
                $project: {
                    cards: 0,
                    offers: 0,
                },
            },
            {
                $lookup: {
                    from: "banks",
                    localField: "bank",
                    foreignField: "_id",
                    as: "bank",
                },
            },
            {
                $unwind: "$bank",
            },
            {
                $project: {
                    bank: {
                        cards: 0,
                    },
                },
            },
            {
                $match: {
                    "bank.status": { $eq: "enabled" },
                },
            },
        ];
        this.collection = db_1.db.getCollection("cards");
    }
    findByName(name) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.collection.findOne((0, utils_1.languageSearchQuery)("name", name));
        });
    }
    findById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const card = yield this.collection
                .aggregate([
                {
                    $match: {
                        _id: new mongodb_1.ObjectId(id),
                    },
                },
                ...this._basePipeline,
            ])
                .toArray()
                .then((cards) => cards[0]);
            if (!card) {
                return null;
            }
            return card;
        });
    }
    getAll() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.collection
                .aggregate([...this._basePipeline])
                .toArray();
        });
    }
    create(card) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield this.collection.insertOne(card);
            if (!result.insertedId) {
                throw new errors_1.InternalServerError("Failed to create card", errors_codes_1.ErrorCodes.CREATE_CARD_FAILED);
            }
            return result.insertedId;
        });
    }
    cardsExists(ids) {
        return __awaiter(this, void 0, void 0, function* () {
            const cards = yield this.collection
                .find({
                _id: { $in: ids.map((id) => new mongodb_1.ObjectId(id)) },
            })
                .toArray();
            return cards.length === ids.length;
        });
    }
    findCards(ids) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.collection
                .aggregate([
                {
                    $match: {
                        _id: { $in: ids.map((id) => new mongodb_1.ObjectId(id)) },
                    },
                },
                ...this._userCardsPipeline,
            ])
                .toArray();
        });
    }
    update(id, card) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield this.collection.updateOne({ _id: new mongodb_1.ObjectId(id) }, { $set: card });
            if (!result.acknowledged) {
                throw new errors_1.InternalServerError("Failed to update card", errors_codes_1.ErrorCodes.UPDATE_CARD_FAILED);
            }
        });
    }
    addOfferToCards(offerId, cards) {
        return this.collection.updateMany({ _id: { $in: cards.map((card) => new mongodb_1.ObjectId(card)) } }, { $addToSet: { offers: new mongodb_1.ObjectId(offerId) } });
    }
    removeOfferFromCards(offerId, cards) {
        return this.collection.updateMany({ _id: { $in: cards.map((card) => new mongodb_1.ObjectId(card)) } }, {
            $pull: { offers: new mongodb_1.ObjectId(offerId) },
        });
    }
}
exports.CardsRepository = CardsRepository;
exports.cardsRepository = new CardsRepository();

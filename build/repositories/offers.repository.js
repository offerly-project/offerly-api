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
exports.offersRepository = exports.OffersRepositry = void 0;
const mongodb_1 = require("mongodb");
const db_1 = require("../configs/db");
const errors_1 = require("../errors/errors");
class OffersRepositry {
    constructor() {
        this.collection = db_1.db.getCollection("offers");
    }
    add(data) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield this.collection.insertOne(data);
            if (!result.insertedId) {
                throw new errors_1.InternalServerError("Failed to insert offer");
            }
            return result.insertedId;
        });
    }
    findById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.collection
                .aggregate([
                {
                    $match: {
                        _id: new mongodb_1.ObjectId(id),
                    },
                },
            ])
                .toArray()
                .then((offers) => offers[0]);
        });
    }
    getAll() {
        return __awaiter(this, void 0, void 0, function* () {
            return this.collection.aggregate().toArray();
        });
    }
    update(id, data) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield this.collection.updateOne({ _id: new mongodb_1.ObjectId(id) }, { $set: data });
            if (!result.matchedCount) {
                throw new errors_1.InternalServerError("Failed to update offer");
            }
        });
    }
    delete(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const offer = yield this.collection.findOneAndDelete({
                _id: new mongodb_1.ObjectId(id),
            });
            if (!offer) {
                throw new errors_1.InternalServerError("Failed to delete offer");
            }
            const cards = offer.applicable_cards.map((card) => card.toString());
            return cards;
        });
    }
    getOffersByQuery(query) {
        const { card, category, page, limit, q } = query;
        const cardFilter = { applicable_cards: { $in: [new mongodb_1.ObjectId(card)] } };
        const categoryFilter = category ? { categories: { $in: [category] } } : {};
        const skip = (+page - 1) * +limit;
        const searchFilter = q
            ? {
                $or: [
                    { "title.en": { $regex: q, $options: "i" } },
                    { "title.ar": { $regex: q, $options: "i" } },
                    { "terms_and_conditions.en": { $regex: q, $options: "i" } },
                    { "terms_and_conditions.ar": { $regex: q, $options: "i" } },
                    { "description.en": { $regex: q, $options: "i" } },
                    { "description.ar": { $regex: q, $options: "i" } },
                ],
            }
            : {};
        return this.collection
            .aggregate([
            {
                $match: Object.assign(Object.assign(Object.assign({}, cardFilter), categoryFilter), searchFilter),
            },
            {
                $facet: {
                    metadata: [
                        { $count: "total" },
                        { $addFields: { page: +page, limit: +limit } },
                    ],
                    data: [
                        { $skip: skip },
                        { $limit: +limit },
                        {
                            $project: {
                                _id: 1,
                                title: 1,
                                description: 1,
                                logo: 1,
                                offer_source_link: 1,
                                status: 1,
                                terms_and_conditions: 1,
                                expiry_date: 1,
                                minimum_amount: 1,
                                cap: 1,
                                channels: 1,
                                starting_date: 1,
                                categories: 1,
                            },
                        },
                    ],
                },
            },
            {
                $unwind: "$metadata",
            },
        ])
            .toArray()
            .then((result) => result[0] || {
            metadata: [{ total: 0, page: +page, limit: +limit }],
            data: [],
        });
    }
}
exports.OffersRepositry = OffersRepositry;
exports.offersRepository = new OffersRepositry();

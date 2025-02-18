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
const errors_codes_1 = require("../errors/errors.codes");
const utils_1 = require("../utils/utils");
const events_repository_1 = require("./events.repository");
class OffersRepositry {
    constructor() {
        this.collection = db_1.db.getCollection("offers");
    }
    add(data) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield this.collection.insertOne(data);
            events_repository_1.eventsRepository.pushEvent({
                type: events_repository_1.EventsEn.NewOffer,
                offer: data.bankId.toString(),
                cards: data.applicable_cards.map((card) => card.toString()),
            });
            if (!result.insertedId) {
                throw new errors_1.InternalServerError("Failed to create offer", errors_codes_1.ErrorCodes.CREATE_OFFER_FAILED);
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
            return this.collection
                .aggregate([
                {
                    $lookup: {
                        from: "banks",
                        localField: "bankId",
                        foreignField: "_id",
                        as: "bank",
                    },
                },
                {
                    $unwind: "$bank",
                },
                {
                    $project: {
                        "bank.cards": 0,
                        bankId: 0,
                    },
                },
            ])
                .toArray();
        });
    }
    update(id, data) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield this.collection.updateOne({ _id: new mongodb_1.ObjectId(id) }, { $set: data });
            if (!result.acknowledged) {
                throw new errors_1.InternalServerError("Failed to update offer", errors_codes_1.ErrorCodes.UPDATE_OFFER_FAILED);
            }
        });
    }
    delete(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const offer = yield this.collection.findOneAndDelete({
                _id: new mongodb_1.ObjectId(id),
            });
            if (!offer) {
                throw new errors_1.InternalServerError("Failed to delete offer", errors_codes_1.ErrorCodes.DELETE_OFFER_FAILED);
            }
            const cards = offer.applicable_cards.map((card) => card.toString());
            return cards;
        });
    }
    getOffersByQuery(query_1) {
        return __awaiter(this, arguments, void 0, function* (query, userCards = [], guest = false) {
            const { card, category, page, limit, q, sort_by, sort_direction, bank } = query;
            const cards = card && card !== "*"
                ? card.split(",").map((cardId) => new mongodb_1.ObjectId(cardId))
                : userCards;
            const cardFilter = card !== "*" && !bank ? { applicable_cards: { $in: cards } } : {};
            const bankFilter = bank ? { bankId: new mongodb_1.ObjectId(bank) } : {};
            const categoryFilter = category
                ? {
                    $or: category.split(",").map((cat) => ({
                        categories: { $regex: cat, $options: "i" },
                    })),
                }
                : {};
            const skip = (+page - 1) * +limit;
            const searchFilter = q
                ? {
                    $or: [
                        { "title.en": { $regex: q, $options: "i" } },
                        { "title.ar": { $regex: q, $options: "i" } },
                    ],
                }
                : {};
            const sortStage = !sort_by
                ? {}
                : sort_by === "expiry_date"
                    ? {
                        $sort: {
                            expiry_date: (0, utils_1.getSortDirectionNumber)(sort_direction ? sort_direction : "asc"),
                        },
                    }
                    : sort_by === "created_at"
                        ? {
                            $sort: {
                                created_at: (0, utils_1.getSortDirectionNumber)(sort_direction ? sort_direction : "desc"),
                            },
                        }
                        : {
                            $sort: {
                                [`title.${sort_by.split("_")[1]}`]: (0, utils_1.getSortDirectionNumber)(sort_direction ? sort_direction : "asc"),
                            },
                        };
            const pipelineBase = [
                {
                    $match: Object.assign(Object.assign(Object.assign(Object.assign(Object.assign(Object.assign({}, (guest ? {} : cardFilter)), categoryFilter), searchFilter), { status: { $eq: "enabled" } }), { expiry_date: { $gte: new Date() } }), bankFilter),
                },
            ];
            if (sort_by) {
                pipelineBase.push(sortStage);
            }
            return this.collection
                .aggregate([
                ...pipelineBase,
                {
                    $facet: {
                        metadata: [
                            { $count: "total" },
                            { $addFields: { page: +page, limit: +limit } },
                        ],
                        data: [
                            {
                                $lookup: {
                                    from: "cards",
                                    localField: "applicable_cards",
                                    foreignField: "_id",
                                    as: "applicable_cards",
                                },
                            },
                            {
                                $lookup: {
                                    from: "categories",
                                    localField: "categories",
                                    foreignField: "_id",
                                    as: "categories",
                                },
                            },
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
                                    categories: {
                                        $map: {
                                            input: "$categories",
                                            as: "category",
                                            in: "$$category.name",
                                        },
                                    },
                                    applicable_cards: {
                                        _id: 1,
                                        name: 1,
                                        logo: 1,
                                    },
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
        });
    }
    getTrendingOffers(limit) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield this.collection
                .aggregate([
                {
                    $match: {
                        expiry_date: { $gte: new Date() },
                        status: { $eq: "enabled" },
                    },
                },
                {
                    $sample: { size: limit },
                },
                {
                    $lookup: {
                        from: "cards",
                        localField: "applicable_cards",
                        foreignField: "_id",
                        as: "applicable_cards",
                    },
                },
                {
                    $lookup: {
                        from: "categories",
                        localField: "categories",
                        foreignField: "_id",
                        as: "categories",
                    },
                },
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
                        categories: {
                            $map: {
                                input: "$categories",
                                as: "category",
                                in: "$$category.name",
                            },
                        },
                        applicable_cards: {
                            _id: 1,
                            name: 1,
                            logo: 1,
                        },
                    },
                },
            ])
                .toArray();
            return result;
        });
    }
    getRecentlyAddedOffers(limit) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.collection
                .aggregate([
                {
                    $sort: {
                        created_at: -1,
                    },
                },
                {
                    $match: {
                        status: { $eq: "enabled" },
                        expiry_date: { $gte: new Date() },
                    },
                },
                {
                    $lookup: {
                        from: "cards",
                        localField: "applicable_cards",
                        foreignField: "_id",
                        as: "applicable_cards",
                    },
                },
                {
                    $lookup: {
                        from: "categories",
                        localField: "categories",
                        foreignField: "_id",
                        as: "categories",
                    },
                },
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
                        categories: {
                            $map: {
                                input: "$categories",
                                as: "category",
                                in: "$$category.name",
                            },
                        },
                        bankId: 1,
                        applicable_cards: {
                            _id: 1,
                            name: 1,
                            logo: 1,
                        },
                    },
                },
                {
                    $group: {
                        _id: "$bankId",
                        offers: { $push: "$$ROOT" },
                    },
                },
                {
                    $project: {
                        bankId: "$_id",
                        offers: { $slice: ["$offers", 0, 2] },
                        _id: 0,
                    },
                },
                {
                    $unwind: "$offers",
                },
                {
                    $replaceRoot: { newRoot: "$offers" },
                },
                {
                    $limit: limit,
                },
            ])
                .toArray();
        });
    }
}
exports.OffersRepositry = OffersRepositry;
exports.offersRepository = new OffersRepositry();

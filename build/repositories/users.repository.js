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
exports.usersRepository = exports.UsersRepository = void 0;
const mongodb_1 = require("mongodb");
const db_1 = require("../configs/db");
const errors_1 = require("../errors/errors");
const errors_codes_1 = require("../errors/errors.codes");
class UsersRepository {
    constructor(db) {
        this._favoritesPipeline = [
            {
                $lookup: {
                    from: "offers",
                    localField: "favorites",
                    foreignField: "_id",
                    as: "favorites",
                },
            },
            {
                $unwind: "$favorites", // Ensure each favorite is handled separately
            },
            {
                $replaceRoot: {
                    newRoot: "$favorites", // Replace the root with the favorite object
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
                    applicable_cards: 1,
                },
            },
        ];
        this.collection = db.getCollection("users");
        this.deletedUsersCollection = db.getCollection("deleted-users");
    }
    getUsersFavorites() {
        return __awaiter(this, void 0, void 0, function* () {
            return this.collection
                .aggregate([
                {
                    $lookup: {
                        from: "offers",
                        localField: "favorites",
                        foreignField: "_id",
                        as: "favorites",
                    },
                },
            ])
                .toArray();
        });
    }
    findUsersWithCards(cards) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.collection
                .aggregate([
                {
                    $match: {
                        cards: {
                            $elemMatch: { $in: cards.map((card) => new mongodb_1.ObjectId(card)) },
                        },
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
            ])
                .toArray();
        });
    }
    create(user) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.collection.insertOne(user);
        });
    }
    findByEmail(email) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.collection.findOne({ email });
        });
    }
    findById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.collection.findOne({ _id: new mongodb_1.ObjectId(id) });
        });
    }
    findByPhone(phone_number) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.collection.findOne({ phone_number });
        });
    }
    updatePassword(id, password) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield this.collection.updateOne({ _id: new mongodb_1.ObjectId(id) }, { $set: { password } });
            if (result.modifiedCount === 0) {
                throw new errors_1.InternalServerError("Password not updated", errors_codes_1.ErrorCodes.UPDATE_PASSWORD_FAILED);
            }
        });
    }
    updateCards(userId, cards) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield this.collection.updateOne({ _id: new mongodb_1.ObjectId(userId) }, {
                $addToSet: {
                    cards: { $each: cards.map((card) => new mongodb_1.ObjectId(card)) },
                },
            });
            if (result.modifiedCount === 0) {
                throw new errors_1.InternalServerError("Cards not updated", errors_codes_1.ErrorCodes.UPDATE_CARD_FAILED);
            }
        });
    }
    removeCards(userId, cards) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield this.collection.updateOne({ _id: new mongodb_1.ObjectId(userId) }, {
                $pull: { cards: { $in: cards.map((card) => new mongodb_1.ObjectId(card)) } },
            });
            if (result.modifiedCount === 0) {
                throw new errors_1.InternalServerError("Cards not removed", errors_codes_1.ErrorCodes.UPDATE_CARD_FAILED);
            }
        });
    }
    getFavoriteOffers(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.collection
                .aggregate([
                {
                    $match: {
                        _id: new mongodb_1.ObjectId(userId),
                    },
                },
                ...this._favoritesPipeline,
            ])
                .toArray();
        });
    }
    patchFavoriteOffers(userId, offers) {
        return __awaiter(this, void 0, void 0, function* () {
            const favoriteObjectIds = offers.map((offer) => new mongodb_1.ObjectId(offer));
            yield this.collection.updateOne({ _id: new mongodb_1.ObjectId(userId) }, {
                $addToSet: {
                    favorites: { $each: favoriteObjectIds },
                },
            });
        });
    }
    moveToHistory(user) {
        return this.deletedUsersCollection.insertOne(user);
    }
    removeFavoriteOffers(userId, offers) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.collection.updateOne({ _id: new mongodb_1.ObjectId(userId) }, {
                $pull: {
                    favorites: { $in: offers.map((offer) => new mongodb_1.ObjectId(offer)) },
                },
            });
        });
    }
    deleteUser(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.collection.deleteOne({ _id: new mongodb_1.ObjectId(userId) });
        });
    }
    update(userId, data) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield this.collection.updateOne({ _id: new mongodb_1.ObjectId(userId) }, { $set: data });
            if (!result.acknowledged) {
                throw new errors_1.InternalServerError("User not updated", errors_codes_1.ErrorCodes.UPDATE_USER_FAILED);
            }
        });
    }
}
exports.UsersRepository = UsersRepository;
exports.usersRepository = new UsersRepository(db_1.db);

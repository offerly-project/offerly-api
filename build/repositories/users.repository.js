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
                $project: {
                    favorites: {
                        applicable_cards: 0,
                    },
                },
            },
        ];
        this.collection = db.getCollection("users");
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
    updatePassword(id, password) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield this.collection.updateOne({ _id: new mongodb_1.ObjectId(id) }, { $set: { password } });
            if (result.modifiedCount === 0) {
                throw new errors_1.InternalServerError("Password not updated");
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
                throw new errors_1.InternalServerError("Cards not updated");
            }
        });
    }
    removeCards(userId, cards) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield this.collection.updateOne({ _id: new mongodb_1.ObjectId(userId) }, {
                $pull: { cards: { $in: cards.map((card) => new mongodb_1.ObjectId(card)) } },
            });
            if (result.modifiedCount === 0) {
                throw new errors_1.InternalServerError("Cards not removed");
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
            yield this.collection.updateOne({ _id: new mongodb_1.ObjectId(userId) }, {
                $set: {
                    favorites: offers.map((offer) => new mongodb_1.ObjectId(offer)),
                },
            });
        });
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
}
exports.UsersRepository = UsersRepository;
exports.usersRepository = new UsersRepository(db_1.db);

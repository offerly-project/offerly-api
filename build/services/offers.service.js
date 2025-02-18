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
exports.offersService = exports.OffersService = void 0;
const mongodb_1 = require("mongodb");
const errors_1 = require("../errors/errors");
const cards_repository_1 = require("../repositories/cards.repository");
const categories_repository_1 = require("../repositories/categories.repository");
const offers_repository_1 = require("../repositories/offers.repository");
const users_repository_1 = require("../repositories/users.repository");
const utils_1 = require("../utils/utils");
class OffersService {
    createOffer(data) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            const exists = yield cards_repository_1.cardsRepository.cardsExists(data.applicable_cards);
            if (!exists) {
                throw new errors_1.NotFoundError("some cards not found");
            }
            const card = yield cards_repository_1.cardsRepository.findById(data.applicable_cards[0]);
            if (!card) {
                throw new errors_1.NotFoundError("Bank not found");
            }
            const bankId = card === null || card === void 0 ? void 0 : card.bank._id;
            const categoriesExist = categories_repository_1.categoriesRepository.categoriesExists(data.categories);
            if (!categoriesExist) {
                throw new errors_1.NotFoundError("categories not found");
            }
            const offer = (0, utils_1.removeUndefinedValuesFromObject)({
                description: data.description,
                terms_and_conditions: data.terms_and_conditions,
                offer_source_link: data.offer_source_link,
                expiry_date: new Date(data.expiry_date),
                minimum_amount: data.minimum_amount,
                channels: data.channels,
                categories: data.categories.map((id) => new mongodb_1.ObjectId(id)) || [],
                applicable_cards: ((_a = data.applicable_cards) === null || _a === void 0 ? void 0 : _a.map((id) => new mongodb_1.ObjectId(id))) || [],
                logo: data.logo,
                bankId: new mongodb_1.ObjectId(bankId),
                discount_code: data.discount_code,
                starting_date: data.starting_date
                    ? new Date(data.starting_date)
                    : undefined,
                cap: data.cap,
                status: "enabled",
                title: data.title,
                created_at: new Date(),
            });
            const id = yield offers_repository_1.offersRepository.add(offer);
            yield cards_repository_1.cardsRepository.addOfferToCards(id.toString(), data.applicable_cards);
            return id;
        });
    }
    getOffers() {
        return __awaiter(this, void 0, void 0, function* () {
            const offers = yield offers_repository_1.offersRepository.getAll();
            return offers;
        });
    }
    getOffer(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const offer = yield offers_repository_1.offersRepository.findById(id);
            if (!offer) {
                throw new errors_1.NotFoundError("Offer not found");
            }
            return offer;
        });
    }
    updateOffer(id, data) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, _b;
            const card = yield cards_repository_1.cardsRepository.findById(data.applicable_cards[0]);
            if (!card) {
                throw new errors_1.NotFoundError("Bank not found");
            }
            const bankId = card === null || card === void 0 ? void 0 : card.bank._id;
            if (data.categories) {
                const categoriesExist = categories_repository_1.categoriesRepository.categoriesExists(data.categories);
                if (!categoriesExist) {
                    throw new errors_1.NotFoundError("categories not found");
                }
            }
            const patchData = (0, utils_1.removeUndefinedValuesFromObject)({
                description: data.description,
                terms_and_conditions: data.terms_and_conditions,
                offer_source_link: data.offer_source_link,
                expiry_date: data.expiry_date ? new Date(data.expiry_date) : undefined,
                minimum_amount: data.minimum_amount,
                channel: data.channels,
                categories: (_a = data.categories) === null || _a === void 0 ? void 0 : _a.map((id) => new mongodb_1.ObjectId(id)),
                applicable_cards: (_b = data.applicable_cards) === null || _b === void 0 ? void 0 : _b.map((id) => new mongodb_1.ObjectId(id)),
                logo: data.logo,
                discount_code: data.discount_code,
                bankId: new mongodb_1.ObjectId(bankId),
                starting_date: data.starting_date
                    ? new Date(data.starting_date)
                    : undefined,
                cap: data.cap,
                status: data.status,
                title: data.title,
            });
            yield offers_repository_1.offersRepository.update(id, patchData);
        });
    }
    deleteOffer(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const cards = yield offers_repository_1.offersRepository.delete(id);
            yield cards_repository_1.cardsRepository.removeOfferFromCards(id, cards);
        });
    }
    getUserOffers(query, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield users_repository_1.usersRepository.findById(userId);
            const userCards = (user === null || user === void 0 ? void 0 : user.cards.map((card) => new mongodb_1.ObjectId(card))) || [];
            if ((query === null || query === void 0 ? void 0 : query.card) === "*" && query.q === "") {
                return {
                    metadata: {
                        total: 0,
                        limit: 0,
                        offset: 0,
                    },
                    data: [],
                };
            }
            const offers = yield offers_repository_1.offersRepository.getOffersByQuery(Object.assign(Object.assign({}, query), { page: query.page || "1", limit: query.limit || "50" }), userCards);
            return offers;
        });
    }
    getNewlyAddedOffers(limit) {
        return __awaiter(this, void 0, void 0, function* () {
            const offers = yield offers_repository_1.offersRepository.getRecentlyAddedOffers(limit);
            return offers;
        });
    }
    getTrendingOffers(limit) {
        return __awaiter(this, void 0, void 0, function* () {
            const offers = yield offers_repository_1.offersRepository.getTrendingOffers(limit);
            return offers;
        });
    }
}
exports.OffersService = OffersService;
exports.offersService = new OffersService();

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
const offers_repository_1 = require("../repositories/offers.repository");
const utils_1 = require("../utils/utils");
class OffersService {
    createOffer(data) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            const cards = yield cards_repository_1.cardsRepository.findCards(data.applicable_cards);
            if (cards.length !== data.applicable_cards.length) {
                throw new errors_1.NotFoundError("cards not found");
            }
            const offer = (0, utils_1.removeUndefinedValuesFromObject)({
                description: data.description,
                terms_and_conditions: data.terms_and_conditions,
                offer_source_link: data.offer_source_link,
                expiry_date: new Date(data.expiry_date),
                minimum_amount: data.minimum_amount,
                channels: data.channels,
                categories: data.categories,
                applicable_cards: ((_a = data.applicable_cards) === null || _a === void 0 ? void 0 : _a.map((id) => new mongodb_1.ObjectId(id))) || [],
                logo: data.logo,
                discount_code: data.discount_code,
                starting_date: data.starting_date
                    ? new Date(data.starting_date)
                    : undefined,
                cap: data.cap,
                status: "enabled",
                title: data.title,
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
            var _a;
            const patchData = (0, utils_1.removeUndefinedValuesFromObject)({
                description: data.description,
                terms_and_conditions: data.terms_and_conditions,
                offer_source_link: data.offer_source_link,
                expiry_date: data.expiry_date ? new Date(data.expiry_date) : undefined,
                minimum_amount: data.minimum_amount,
                channel: data.channels,
                categories: data.categories,
                applicable_cards: (_a = data.applicable_cards) === null || _a === void 0 ? void 0 : _a.map((id) => new mongodb_1.ObjectId(id)),
                logo: data.logo,
                discount_code: data.discount_code,
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
    getUserOffers(query) {
        return __awaiter(this, void 0, void 0, function* () {
            const offers = yield offers_repository_1.offersRepository.getOffersByQuery(query);
            return offers;
        });
    }
}
exports.OffersService = OffersService;
exports.offersService = new OffersService();

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
exports.cardsService = exports.CardsService = void 0;
const mongodb_1 = require("mongodb");
const errors_1 = require("../errors/errors");
const banks_repository_1 = require("../repositories/banks.repository");
const cards_repository_1 = require("../repositories/cards.repository");
const users_repository_1 = require("../repositories/users.repository");
const utils_1 = require("../utils/utils");
class CardsService {
    getAllCards() {
        return __awaiter(this, void 0, void 0, function* () {
            const cards = yield cards_repository_1.cardsRepository.getAll();
            return cards;
        });
    }
    getCardById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const card = yield cards_repository_1.cardsRepository.findById(id);
            if (!card) {
                throw new errors_1.NotFoundError("Card with this id does not exist");
            }
            return card;
        });
    }
    createCard(card) {
        return __awaiter(this, void 0, void 0, function* () {
            const bankDoc = yield banks_repository_1.banksRepository.findById(card.bank);
            if (!bankDoc) {
                throw new errors_1.NotFoundError("Bank with this name does not exist");
            }
            const cardDoc = yield cards_repository_1.cardsRepository.findByName(card.name);
            if (cardDoc) {
                throw new errors_1.ConflictError("Card with this name already exists");
            }
            const newCard = (0, utils_1.removeUndefinedValuesFromObject)({
                name: card.name,
                bank: new mongodb_1.ObjectId(card.bank),
                logo: card.logo,
                grade: card.grade,
                scheme: card.scheme,
                status: "enabled",
                offers: [],
            });
            const cardId = yield cards_repository_1.cardsRepository.create(newCard);
            const bankCards = (yield banks_repository_1.banksRepository.getBankCardsIds(card.bank)) || [];
            yield banks_repository_1.banksRepository.update(card.bank, Object.assign(Object.assign({}, bankDoc), { cards: [
                    ...bankCards.map((card) => new mongodb_1.ObjectId(card.id)),
                    new mongodb_1.ObjectId(cardId),
                ] }));
            return cardId;
        });
    }
    updateCard(id, card) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            const cardDoc = yield cards_repository_1.cardsRepository.findById(id);
            if (!cardDoc) {
                throw new errors_1.NotFoundError("Card not found");
            }
            if (card.name) {
                const foundCard = yield cards_repository_1.cardsRepository.findByName(card.name);
                if (foundCard && foundCard._id.toString() !== id) {
                    throw new errors_1.NotFoundError("Card name already exists");
                }
            }
            const patchData = (0, utils_1.removeUndefinedValuesFromObject)({
                name: card.name,
                bank: card.bank ? new mongodb_1.ObjectId(card.bank) : undefined,
                logo: card.logo,
                grade: card.grade,
                scheme: card.scheme,
                status: card.status,
                offers: (_a = card.offers) === null || _a === void 0 ? void 0 : _a.map((offer) => new mongodb_1.ObjectId(offer)),
            });
            yield cards_repository_1.cardsRepository.update(id, patchData);
        });
    }
    getUserCards(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield users_repository_1.usersRepository.findById(userId);
            if (!user) {
                throw new errors_1.NotFoundError("User not found");
            }
            return cards_repository_1.cardsRepository.findCards(user.cards.map((card) => card.toString()));
        });
    }
}
exports.CardsService = CardsService;
exports.cardsService = new CardsService();

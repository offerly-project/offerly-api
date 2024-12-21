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
exports.cardsUserController = exports.cardsAdminController = void 0;
const http_status_codes_1 = require("http-status-codes");
const cards_service_1 = require("../services/cards.service");
const users_service_1 = require("../services/users.service");
const utils_1 = require("../utils/utils");
const getCardsHandler = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const cards = yield cards_service_1.cardsService.getAllCards();
        res.status(http_status_codes_1.StatusCodes.OK).send((0, utils_1.transformDocsResponse)(cards));
    }
    catch (error) {
        next(error);
    }
});
const getCardHandler = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const cards = yield cards_service_1.cardsService.getCardById(req.params.id);
        res.status(http_status_codes_1.StatusCodes.OK).send((0, utils_1.transformDocsResponse)(cards));
    }
    catch (error) {
        next(error);
    }
});
const createCardHandler = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const cardId = yield cards_service_1.cardsService.createCard(req.body);
        res.status(http_status_codes_1.StatusCodes.OK).send({ id: cardId });
    }
    catch (e) {
        next(e);
    }
});
const updateCardHandler = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const cardData = req.body;
        yield cards_service_1.cardsService.updateCard(id, cardData);
        res.status(http_status_codes_1.StatusCodes.OK).send({ message: "Card details updated" });
    }
    catch (e) {
        next(e);
    }
});
exports.cardsAdminController = {
    getCardsHandler,
    createCardHandler,
    getCardHandler,
    updateCardHandler,
};
const getUserCardsHandler = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = req.user.id;
        const cards = yield cards_service_1.cardsService.getUserCards(userId);
        res.status(http_status_codes_1.StatusCodes.OK).send((0, utils_1.transformDocsResponse)(cards));
    }
    catch (e) {
        next(e);
    }
});
const patchUserCardsHandler = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = req.user.id;
        const { cards } = req.body;
        yield users_service_1.usersService.updateUserCards(userId, cards);
        res.status(http_status_codes_1.StatusCodes.OK).send({
            message: "User cards updated",
        });
    }
    catch (e) {
        next(e);
    }
});
const deleteUserCardsHandler = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = req.user.id;
        const cards = req.query.cards.split(",");
        yield users_service_1.usersService.deleteUserCards(userId, cards);
        res.status(http_status_codes_1.StatusCodes.OK).send({
            message: "User cards deleted",
        });
    }
    catch (e) {
        next(e);
    }
});
exports.cardsUserController = {
    getUserCardsHandler,
    patchUserCardsHandler,
    deleteUserCardsHandler,
};

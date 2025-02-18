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
exports.favoritesController = void 0;
const users_repository_1 = require("../repositories/users.repository");
const utils_1 = require("../utils/utils");
const getUserFavoriteOffersHandler = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = req.user.id;
        const favorites = yield users_repository_1.usersRepository.getFavoriteOffers(userId);
        const elements = favorites;
        res.status(200).send((0, utils_1.transformDocsResponse)(elements));
    }
    catch (e) {
        next(e);
    }
});
const patchUserFavoriteOffersHandler = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = req.user.id;
        const offers = req.body.offers;
        yield users_repository_1.usersRepository.patchFavoriteOffers(userId, offers);
        res.status(200).send({
            message: "favorite offers patched",
        });
    }
    catch (e) {
        next(e);
    }
});
const deleteUserFavoriteOffersHandler = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = req.user.id;
        const offers = req.query.offers.split(",");
        yield users_repository_1.usersRepository.removeFavoriteOffers(userId, offers);
        res.status(200).send({
            message: "favorite offers removed",
        });
    }
    catch (e) {
        next(e);
    }
});
exports.favoritesController = {
    getUserFavoriteOffersHandler,
    patchUserFavoriteOffersHandler,
    deleteUserFavoriteOffersHandler,
};

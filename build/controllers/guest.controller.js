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
exports.guestController = void 0;
const offers_repository_1 = require("../repositories/offers.repository");
const users_service_1 = require("../services/users.service");
const utils_1 = require("../utils/utils");
const getGuestTokenHandler = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const token = yield (0, utils_1.generateToken)("_", "guest", "login", {
            expiresIn: "24h",
        });
        res.json({ token });
    }
    catch (e) {
        next(e);
    }
});
const getGuestOffersHandler = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const offers = yield offers_repository_1.offersRepository.getOffersByQuery({
            page: "1",
            limit: "10",
        }, undefined, true);
        res.send((0, utils_1.transformDocsResponse)(offers.data));
    }
    catch (e) {
        next(e);
    }
});
const contactGuestHandler = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = req.user.id;
        yield users_service_1.usersService.guestContact(req.body);
        res.status(201).send({ message: "Contact email sent successfully" });
    }
    catch (e) {
        next(e);
    }
});
exports.guestController = {
    getGuestOffersHandler,
    getGuestTokenHandler,
    contactGuestHandler,
};

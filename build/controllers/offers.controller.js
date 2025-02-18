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
exports.offersController = void 0;
const http_status_codes_1 = require("http-status-codes");
const offers_service_1 = require("../services/offers.service");
const utils_1 = require("../utils/utils");
const createOfferHandler = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = yield offers_service_1.offersService.createOffer(req.body);
        res.status(http_status_codes_1.StatusCodes.OK).send({ id });
    }
    catch (e) {
        next(e);
    }
});
const getOffersHandler = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const offers = yield offers_service_1.offersService.getOffers();
        res.status(http_status_codes_1.StatusCodes.OK).send((0, utils_1.transformDocsResponse)(offers));
    }
    catch (e) {
        next(e);
    }
});
const getOfferHandler = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const offer = yield offers_service_1.offersService.getOffer(req.params.id);
        res.status(http_status_codes_1.StatusCodes.OK).send((0, utils_1.transformDocsResponse)(offer));
    }
    catch (e) {
        next(e);
    }
});
const updateOfferHandler = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield offers_service_1.offersService.updateOffer(req.params.id, req.body);
        res.status(http_status_codes_1.StatusCodes.OK).send({ message: "Offer details updated" });
    }
    catch (e) {
        next(e);
    }
});
const deleteOfferHandler = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield offers_service_1.offersService.deleteOffer(req.params.id);
        res.status(http_status_codes_1.StatusCodes.OK).send({ message: "Offer deleted" });
    }
    catch (e) {
        next(e);
    }
});
const getUserOffersHandler = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = req.user.id;
        const offers = yield offers_service_1.offersService.getUserOffers(req.query, userId);
        res.status(http_status_codes_1.StatusCodes.OK).send((0, utils_1.transformDocsResponse)(offers));
    }
    catch (e) {
        next(e);
    }
});
const getUserTrendingOffersHandler = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const limit = req.query.limit || 10;
        const offers = yield offers_service_1.offersService.getTrendingOffers(+limit);
        res.status(http_status_codes_1.StatusCodes.OK).send((0, utils_1.transformDocsResponse)(offers));
    }
    catch (e) {
        next(e);
    }
});
const getUserNewlyAddedOfferHandler = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const limit = req.query.limit || 10;
        const offers = yield offers_service_1.offersService.getNewlyAddedOffers(+limit);
        res.status(http_status_codes_1.StatusCodes.OK).send((0, utils_1.transformDocsResponse)(offers));
    }
    catch (e) {
        next(e);
    }
});
exports.offersController = {
    createOfferHandler,
    getOffersHandler,
    getOfferHandler,
    updateOfferHandler,
    deleteOfferHandler,
    getUserOffersHandler,
    getUserTrendingOffersHandler,
    getUserNewlyAddedOfferHandler,
};

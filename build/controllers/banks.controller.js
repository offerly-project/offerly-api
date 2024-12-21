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
exports.banksUserController = exports.banksAdminController = void 0;
const http_status_codes_1 = require("http-status-codes");
const banks_service_1 = require("../services/banks.service");
const utils_1 = require("../utils/utils");
const createBankHandler = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const bankData = req.body;
        const id = yield banks_service_1.banksService.createNewBank(bankData);
        res.status(http_status_codes_1.StatusCodes.OK).send({ id });
    }
    catch (e) {
        next(e);
    }
});
const updateBankHandler = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const bankData = req.body;
        yield banks_service_1.banksService.updateBank(id, bankData);
        res.status(http_status_codes_1.StatusCodes.OK).send({ message: "bank details updated" });
    }
    catch (e) {
        next(e);
    }
});
const getBanksHandler = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const banks = yield banks_service_1.banksService.getBanks();
        res.status(http_status_codes_1.StatusCodes.OK).send((0, utils_1.transformDocsResponse)(banks));
    }
    catch (e) {
        next(e);
    }
});
const getBankHandler = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const banks = yield banks_service_1.banksService.getBank(req.params.id);
        res.status(http_status_codes_1.StatusCodes.OK).send((0, utils_1.transformDocsResponse)(banks));
    }
    catch (e) {
        next(e);
    }
});
exports.banksAdminController = {
    createBankHandler,
    updateBankHandler,
    getBanksHandler,
    getBankHandler,
};
const getUserBanksHandler = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const banks = yield banks_service_1.banksService.getUserBanks();
        res.status(http_status_codes_1.StatusCodes.OK).send((0, utils_1.transformDocsResponse)(banks));
    }
    catch (e) {
        next(e);
    }
});
const getUserBankCardsHandler = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const cards = yield banks_service_1.banksService.getBankCardsById(req.params.id);
        res.status(http_status_codes_1.StatusCodes.OK).send((0, utils_1.transformDocsResponse)(cards));
    }
    catch (e) {
        next(e);
    }
});
exports.banksUserController = {
    getUserBanksHandler,
    getUserBankCardsHandler,
};

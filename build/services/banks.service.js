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
exports.banksService = exports.BanksService = void 0;
const mongodb_1 = require("mongodb");
const errors_1 = require("../errors/errors");
const errors_codes_1 = require("../errors/errors.codes");
const banks_repository_1 = require("../repositories/banks.repository");
const utils_1 = require("../utils/utils");
class BanksService {
    createNewBank(bank) {
        return __awaiter(this, void 0, void 0, function* () {
            const bankExists = yield banks_repository_1.banksRepository.bankNameExists(bank.name);
            if (bankExists) {
                throw new errors_1.ConflictError("Bank already exists", errors_codes_1.ErrorCodes.BANK_ALREADY_EXISTS);
            }
            const newBank = (0, utils_1.removeUndefinedValuesFromObject)({
                country: bank.country,
                type: bank.type,
                name: bank.name,
                logo: bank.logo,
                status: "enabled",
                cards: [],
            });
            return banks_repository_1.banksRepository.add(newBank);
        });
    }
    updateBank(id, bank) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            const bankExists = yield banks_repository_1.banksRepository.findById(id);
            if (!bankExists) {
                throw new errors_1.NotFoundError("Bank not found", errors_codes_1.ErrorCodes.BANK_NOT_FOUND);
            }
            if (bank.name) {
                const foundBank = yield banks_repository_1.banksRepository.findByName(bank.name);
                if (foundBank && foundBank._id.toString() !== id) {
                    throw new errors_1.ConflictError("Bank name already exists", errors_codes_1.ErrorCodes.BANK_ALREADY_EXISTS);
                }
            }
            const patchData = (0, utils_1.removeUndefinedValuesFromObject)({
                country: bank.country,
                type: bank.type,
                name: bank.name,
                logo: bank.logo,
                status: bank.status,
                cards: (_a = bank.cards) === null || _a === void 0 ? void 0 : _a.map((card) => new mongodb_1.ObjectId(card)),
            });
            banks_repository_1.banksRepository.update(id, patchData);
        });
    }
    getBanks() {
        return __awaiter(this, void 0, void 0, function* () {
            return banks_repository_1.banksRepository.getAll();
        });
    }
    getUserBanks() {
        return __awaiter(this, void 0, void 0, function* () {
            return banks_repository_1.banksRepository.getUserBanks();
        });
    }
    getBank(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const bank = yield banks_repository_1.banksRepository.findById(id);
            if (!bank) {
                throw new errors_1.NotFoundError("Bank not found", errors_codes_1.ErrorCodes.BANK_NOT_FOUND);
            }
            return bank;
        });
    }
    getBankCardsById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return banks_repository_1.banksRepository.getCardsByBankId(id);
        });
    }
}
exports.BanksService = BanksService;
exports.banksService = new BanksService();

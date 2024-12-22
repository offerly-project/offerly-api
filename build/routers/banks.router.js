"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.banksUserRouter = exports.banksAdminRouter = void 0;
const express_1 = require("express");
const banks_controller_1 = require("../controllers/banks.controller");
const auth_middleware_1 = require("../middlewares/auth.middleware");
const utils_1 = require("../utils/utils");
const bank_validators_1 = require("../validators/bank.validators");
exports.banksAdminRouter = (0, express_1.Router)();
exports.banksAdminRouter.get("/", banks_controller_1.banksAdminController.getBanksHandler);
exports.banksAdminRouter.get("/:id", banks_controller_1.banksAdminController.getBankHandler);
exports.banksAdminRouter.post("/", (0, utils_1.validateRequest)(bank_validators_1.createBankSchema), banks_controller_1.banksAdminController.createBankHandler);
exports.banksAdminRouter.patch("/:id", (0, utils_1.validateRequest)(bank_validators_1.updateBankSchema), banks_controller_1.banksAdminController.updateBankHandler);
exports.banksUserRouter = (0, express_1.Router)();
exports.banksUserRouter.get("/", auth_middleware_1.authorizeUser, banks_controller_1.banksUserController.getUserBanksHandler);
exports.banksUserRouter.get("/:id/cards", auth_middleware_1.authorizeUser, banks_controller_1.banksUserController.getUserBankCardsHandler);
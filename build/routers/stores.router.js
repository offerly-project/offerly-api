"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.storesRouter = void 0;
const express_1 = require("express");
const stores_controller_1 = require("../controllers/stores.controller");
const utils_1 = require("../utils/utils");
const store_validators_1 = require("../validators/store.validators");
// NON-MVP CODE
exports.storesRouter = (0, express_1.Router)();
exports.storesRouter.post("/", (0, utils_1.validateRequest)(store_validators_1.createStoreSchema), stores_controller_1.storesController.createStoreHandler);
exports.storesRouter.get("/", stores_controller_1.storesController.getAllStoresHandler);
exports.storesRouter.get("/:id", stores_controller_1.storesController.getStoreHandler);
exports.storesRouter.patch("/:id", stores_controller_1.storesController.updateStoreHandler);

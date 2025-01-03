"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.offersUserRouter = exports.offersAdminRouter = void 0;
const express_1 = require("express");
const offers_controller_1 = require("../controllers/offers.controller");
const auth_middleware_1 = require("../middlewares/auth.middleware");
const query_middleware_1 = require("../middlewares/query.middleware");
const utils_1 = require("../utils/utils");
const offer_validators_1 = require("../validators/offer.validators");
exports.offersAdminRouter = (0, express_1.Router)();
exports.offersAdminRouter.post("/", (0, utils_1.validateRequest)(offer_validators_1.createOfferSchema), offers_controller_1.offersController.createOfferHandler);
exports.offersAdminRouter.get("/", offers_controller_1.offersController.getOffersHandler);
exports.offersAdminRouter.get("/:id", offers_controller_1.offersController.getOfferHandler);
exports.offersAdminRouter.patch("/:id", offers_controller_1.offersController.updateOfferHandler);
exports.offersAdminRouter.delete("/:id", offers_controller_1.offersController.deleteOfferHandler);
exports.offersUserRouter = (0, express_1.Router)();
exports.offersUserRouter.get("/", auth_middleware_1.authorizeUser, query_middleware_1.queryMiddleware, (0, utils_1.validateRequest)(offer_validators_1.getUserOffersSchema), offers_controller_1.offersController.getUserOffersHandler);

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.userFavoriteOffersRouter = void 0;
const express_1 = require("express");
const favorites_controller_1 = require("../controllers/favorites.controller");
const auth_middleware_1 = require("../middlewares/auth.middleware");
const utils_1 = require("../utils/utils");
const favorites_validators_1 = require("../validators/favorites.validators");
exports.userFavoriteOffersRouter = (0, express_1.Router)();
exports.userFavoriteOffersRouter.get("/", auth_middleware_1.authorizeUser, favorites_controller_1.favoritesController.getUserFavoriteOffersHandler);
exports.userFavoriteOffersRouter.patch("/", auth_middleware_1.authorizeUser, (0, utils_1.validateRequest)(favorites_validators_1.patchUserFavoriteOffersSchema), favorites_controller_1.favoritesController.patchUserFavoriteOffersHandler);
exports.userFavoriteOffersRouter.delete("/", auth_middleware_1.authorizeUser, (0, utils_1.validateRequest)(favorites_validators_1.deleteUserFavoriteOffersSchema), favorites_controller_1.favoritesController.deleteUserFavoriteOffersHandler);

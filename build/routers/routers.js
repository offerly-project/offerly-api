"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.userRouter = exports.adminRouter = void 0;
const express_1 = require("express");
const user_controller_1 = require("../controllers/user.controller");
const auth_middleware_1 = require("../middlewares/auth.middleware");
const utils_1 = require("../utils/utils");
const user_validators_1 = require("../validators/user.validators");
const auth_router_1 = require("./auth.router");
const banks_router_1 = require("./banks.router");
const cards_router_1 = require("./cards.router");
const favorites_router_1 = require("./favorites.router");
const guest_router_1 = require("./guest.router");
const offers_router_1 = require("./offers.router");
const user_router_1 = require("./user.router");
exports.adminRouter = (0, express_1.Router)();
exports.adminRouter.use("/auth", auth_router_1.adminAuthRouter);
exports.adminRouter.use("/banks", auth_middleware_1.authorizeAdmin, banks_router_1.banksAdminRouter);
exports.adminRouter.use("/cards", auth_middleware_1.authorizeAdmin, cards_router_1.cardsAdminRouter);
exports.adminRouter.use("/offers", auth_middleware_1.authorizeAdmin, offers_router_1.offersAdminRouter);
exports.adminRouter.use("/user", auth_middleware_1.authorizeAdmin, user_router_1.userAdminRouter);
exports.userRouter = (0, express_1.Router)();
exports.userRouter.use("/auth", auth_router_1.userAuthRouter);
exports.userRouter.use("/banks", auth_middleware_1.authorizeUser, banks_router_1.banksUserRouter);
exports.userRouter.use("/cards", auth_middleware_1.authorizeUser, cards_router_1.cardsUserRouter);
exports.userRouter.use("/offers", offers_router_1.offersUserRouter);
exports.userRouter.use("/favorites", auth_middleware_1.authorizeUser, favorites_router_1.userFavoriteOffersRouter);
exports.userRouter.use("/user", auth_middleware_1.authorizeUser, user_router_1.userUserRouter);
exports.userRouter.use("/guest", guest_router_1.guestRouter);
exports.userRouter.post("/signup", (0, utils_1.validateRequest)(user_validators_1.signupUserSchema), user_controller_1.userController.createUserHandler);

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
exports.userUserRouter = exports.userAdminRouter = void 0;
const express_1 = require("express");
const lodash_1 = require("lodash");
const user_controller_1 = require("../controllers/user.controller");
const auth_middleware_1 = require("../middlewares/auth.middleware");
const admins_repository_1 = require("../repositories/admins.repository");
const users_repository_1 = require("../repositories/users.repository");
const utils_1 = require("../utils/utils");
const user_validators_1 = require("../validators/user.validators");
exports.userAdminRouter = (0, express_1.Router)();
exports.userAdminRouter.get("/", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.user.id;
    const data = yield admins_repository_1.adminsRepository.findById(userId);
    res.send((0, lodash_1.omit)(data, ["password", "_id"]));
}));
exports.userUserRouter = (0, express_1.Router)();
exports.userUserRouter.get("/", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.user.id;
    const data = yield users_repository_1.usersRepository.findById(userId);
    res.send((0, lodash_1.omit)(data, ["password", "_id"]));
}));
exports.userUserRouter.patch("/", auth_middleware_1.authorizeUser, (0, utils_1.validateRequest)(user_validators_1.patchUserSchema), user_controller_1.userController.patchUserHandler);
exports.userUserRouter.post("/contact", auth_middleware_1.authorizeUser, (0, utils_1.validateRequest)(user_validators_1.userContactSchema), user_controller_1.userController.contactHandler);
exports.userUserRouter.delete("/", auth_middleware_1.authorizeUser, user_controller_1.userController.deleteUserHandler);

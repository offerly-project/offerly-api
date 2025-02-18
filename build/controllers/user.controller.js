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
exports.userController = void 0;
const mail_service_1 = require("../services/mail.service");
const users_service_1 = require("../services/users.service");
const utils_1 = require("../utils/utils");
const createUserHandler = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = req.body;
        const userDoc = yield users_service_1.usersService.signupUser(user);
        const token = yield (0, utils_1.generateToken)(userDoc.insertedId.toString(), "user", "login");
        mail_service_1.mailService.sendWelcomeMail(user.email, user.full_name, user.language);
        res.status(201).send({ message: "User created successfully", token });
    }
    catch (e) {
        next(e);
    }
});
const contactHandler = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = req.user.id;
        yield users_service_1.usersService.userContact(userId, req.body);
        res.status(201).send({ message: "Contact email sent successfully" });
    }
    catch (e) {
        next(e);
    }
});
const patchUserHandler = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = req.body;
        const userId = req.user.id;
        yield users_service_1.usersService.updateUser(userId, user);
        res.status(200).send({ message: "User updated successfully" });
    }
    catch (e) {
        next(e);
    }
});
const deleteUserHandler = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { user } = req;
        const id = user.id;
        yield users_service_1.usersService.deleteUser(id);
        res.status(200).send({ message: "User deleted successfully" });
    }
    catch (e) {
        next(e);
    }
});
exports.userController = {
    createUserHandler,
    patchUserHandler,
    deleteUserHandler,
    contactHandler,
};

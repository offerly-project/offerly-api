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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.usersService = exports.UsersService = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const env_1 = require("../configs/env");
const errors_1 = require("../errors/errors");
const errors_codes_1 = require("../errors/errors.codes");
const cards_repository_1 = require("../repositories/cards.repository");
const users_repository_1 = require("../repositories/users.repository");
const utils_1 = require("../utils/utils");
const mail_service_1 = require("./mail.service");
class UsersService {
    constructor() {
        this.deleteUser = (userId) => __awaiter(this, void 0, void 0, function* () {
            const user = yield users_repository_1.usersRepository.findById(userId);
            if (!user) {
                throw new errors_1.NotFoundError("User not found", errors_codes_1.ErrorCodes.USER_NOT_FOUND);
            }
            const historicalUser = Object.assign(Object.assign({}, user), { full_name: "---", email: "---", password: "---" });
            yield users_repository_1.usersRepository.moveToHistory(historicalUser);
            yield users_repository_1.usersRepository.deleteUser(userId);
        });
    }
    signupUser(body) {
        return __awaiter(this, void 0, void 0, function* () {
            const userDoc = yield users_repository_1.usersRepository.findByEmail(body.email);
            if (userDoc) {
                throw new errors_1.ConflictError("User with same email address already exists", errors_codes_1.ErrorCodes.USER_ALREADY_EXISTS);
            }
            const hashedPassword = yield bcrypt_1.default
                .hash(body.password, +env_1.env.SALT_ROUNDS)
                .catch((e) => {
                throw new errors_1.InternalServerError("Failed to hash password", errors_codes_1.ErrorCodes.HASH_ERROR);
            });
            const user = {
                email: body.email.toLowerCase(),
                password: hashedPassword,
                full_name: body.full_name,
                cards: [],
                favorites: [],
                language: body.language,
                notification_tokens: [],
                logged_in: true,
            };
            return yield users_repository_1.usersRepository.create(user);
        });
    }
    updateUserCards(userId, cards) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield users_repository_1.usersRepository.findById(userId);
            if (!user) {
                throw new errors_1.NotFoundError("User with this id does not exist", errors_codes_1.ErrorCodes.USER_NOT_FOUND);
            }
            const cardsDocs = yield cards_repository_1.cardsRepository.findCards(cards);
            if (cardsDocs.length !== cards.length) {
                throw new errors_1.NotFoundError("cards not found", errors_codes_1.ErrorCodes.CARD_NOT_FOUND);
            }
            yield users_repository_1.usersRepository.updateCards(userId, cards);
        });
    }
    deleteUserCards(userId, cards) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield users_repository_1.usersRepository.findById(userId);
            if (!user) {
                throw new errors_1.NotFoundError("User with this id does not exist", errors_codes_1.ErrorCodes.USER_NOT_FOUND);
            }
            const cardsDocs = yield cards_repository_1.cardsRepository.findCards(cards);
            if (cardsDocs.length !== cards.length) {
                throw new errors_1.NotFoundError("cards not found", errors_codes_1.ErrorCodes.CARD_NOT_FOUND);
            }
            yield users_repository_1.usersRepository.removeCards(userId, cards);
        });
    }
    updateUser(userId, data) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, _b, _c;
            const user = yield users_repository_1.usersRepository.findById(userId);
            if (!user) {
                throw new errors_1.NotFoundError("User not found", errors_codes_1.ErrorCodes.USER_NOT_FOUND);
            }
            if (data.phone_number) {
                const userDoc = yield users_repository_1.usersRepository.findByPhone(data.phone_number);
                if (userDoc && !userDoc._id.equals(userId)) {
                    throw new errors_1.ConflictError("User with same phone number already exists", errors_codes_1.ErrorCodes.USER_ALREADY_EXISTS);
                }
            }
            let notificationToken = (_a = user.notification_token) !== null && _a !== void 0 ? _a : [];
            if (((_b = data.notification_token) === null || _b === void 0 ? void 0 : _b.token) &&
                !((_c = user.notification_token) === null || _c === void 0 ? void 0 : _c.find((t) => { var _a; return t.token === ((_a = data.notification_token) === null || _a === void 0 ? void 0 : _a.token); }))) {
                notificationToken = [
                    ...notificationToken,
                    {
                        token: data.notification_token.token,
                        timestamp: data.notification_token.timestamp,
                        platform: data.notification_token.platform,
                    },
                ];
            }
            const userPatch = (0, utils_1.removeUndefinedValuesFromObject)({
                full_name: data.full_name,
                phone_number: data.phone_number,
                language: data.language,
                notification_token: notificationToken || undefined,
            });
            yield users_repository_1.usersRepository.update(userId, userPatch);
        });
    }
    userContact(userId_1, _a) {
        return __awaiter(this, arguments, void 0, function* (userId, { subject, message }) {
            const user = yield users_repository_1.usersRepository.findById(userId);
            if (!user) {
                throw new errors_1.NotFoundError("User not found", errors_codes_1.ErrorCodes.USER_NOT_FOUND);
            }
            const { full_name, email } = user;
            mail_service_1.mailService.sendContactMail(email, full_name, subject, message);
        });
    }
    guestContact(_a) {
        return __awaiter(this, arguments, void 0, function* ({ email, subject, message }) {
            mail_service_1.mailService.sendContactMail(email, "Guest", subject, message);
        });
    }
}
exports.UsersService = UsersService;
exports.usersService = new UsersService();

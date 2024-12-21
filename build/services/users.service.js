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
const cards_repository_1 = require("../repositories/cards.repository");
const users_repository_1 = require("../repositories/users.repository");
class UsersService {
    signupUser(body) {
        return __awaiter(this, void 0, void 0, function* () {
            const userDoc = yield users_repository_1.usersRepository.findByEmail(body.email);
            if (userDoc) {
                throw new errors_1.ConflictError("User with same email address already exists");
            }
            const hashedPassword = yield bcrypt_1.default
                .hash(body.password, +env_1.env.SALT_ROUNDS)
                .catch((e) => {
                throw new errors_1.InternalServerError("Failed to hash password");
            });
            const user = {
                email: body.email,
                password: hashedPassword,
                full_name: body.full_name,
                cards: [],
                favorites: [],
            };
            yield users_repository_1.usersRepository.create(user);
        });
    }
    updateUserCards(userId, cards) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield users_repository_1.usersRepository.findById(userId);
            if (!user) {
                throw new errors_1.ConflictError("User with this id does not exist");
            }
            const cardsDocs = yield cards_repository_1.cardsRepository.findCards(cards);
            if (cardsDocs.length !== cards.length) {
                throw new errors_1.NotFoundError("cards not found");
            }
            yield users_repository_1.usersRepository.updateCards(userId, cards);
        });
    }
    deleteUserCards(userId, cards) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield users_repository_1.usersRepository.findById(userId);
            if (!user) {
                throw new errors_1.ConflictError("User with this id does not exist");
            }
            const cardsDocs = yield cards_repository_1.cardsRepository.findCards(cards);
            if (cardsDocs.length !== cards.length) {
                throw new errors_1.NotFoundError("cards not found");
            }
            yield users_repository_1.usersRepository.removeCards(userId, cards);
        });
    }
}
exports.UsersService = UsersService;
exports.usersService = new UsersService();

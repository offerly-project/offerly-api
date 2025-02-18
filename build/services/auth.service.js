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
exports.userAuthService = exports.adminAuthService = exports.UserAuthService = exports.AdminAuthService = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const lodash_1 = require("lodash");
const env_1 = require("../configs/env");
const errors_1 = require("../errors/errors");
const errors_codes_1 = require("../errors/errors.codes");
const admins_repository_1 = require("../repositories/admins.repository");
const users_repository_1 = require("../repositories/users.repository");
const utils_1 = require("../utils/utils");
class AdminAuthService {
    login(username, password) {
        return __awaiter(this, void 0, void 0, function* () {
            const admin = yield admins_repository_1.adminsRepository.findByUsername(username);
            if (!admin) {
                throw new errors_1.NotFoundError("User not found", errors_codes_1.ErrorCodes.USER_NOT_FOUND);
            }
            const validPassword = yield (0, utils_1.validatePassword)(password, admin.password);
            if (!validPassword) {
                throw new errors_1.BadRequestError("Incorrect password", errors_codes_1.ErrorCodes.INCORRECT_PASSWORD);
            }
            const token = yield (0, utils_1.generateToken)(admin._id.toString(), "admin", "login");
            return { token, admin: (0, lodash_1.omit)(admin, ["password", "_id"]) };
        });
    }
}
exports.AdminAuthService = AdminAuthService;
class UserAuthService {
    login(email, password) {
        return __awaiter(this, void 0, void 0, function* () {
            email = email.toLowerCase();
            const user = yield users_repository_1.usersRepository.findByEmail(email);
            if (!user) {
                throw new errors_1.NotFoundError("User not found", errors_codes_1.ErrorCodes.USER_NOT_FOUND);
            }
            const validPassword = yield (0, utils_1.validatePassword)(password, user.password);
            if (!validPassword) {
                throw new errors_1.BadRequestError("Incorrect password", errors_codes_1.ErrorCodes.INCORRECT_PASSWORD);
            }
            const token = yield (0, utils_1.generateToken)(user._id.toString(), "user", "login");
            users_repository_1.usersRepository.update(user._id.toString(), { logged_in: true });
            return {
                token,
                user: (0, lodash_1.omit)(user, ["password", "_id"]),
            };
        });
    }
    changePassword(id, password) {
        return __awaiter(this, void 0, void 0, function* () {
            const hash = yield bcrypt_1.default.hash(password, +env_1.env.SALT_ROUNDS);
            yield users_repository_1.usersRepository.updatePassword(id, hash);
        });
    }
    changePasswordWithOldPassword(id, oldPassword, newPassword) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield users_repository_1.usersRepository.findById(id);
            if (!user) {
                throw new errors_1.NotFoundError("User not found", errors_codes_1.ErrorCodes.USER_NOT_FOUND);
            }
            const validPassword = yield (0, utils_1.validatePassword)(oldPassword, user.password);
            if (!validPassword) {
                throw new errors_1.BadRequestError("Incorrect password", errors_codes_1.ErrorCodes.INCORRECT_PASSWORD);
            }
            this.changePassword(id, newPassword);
        });
    }
    logout(id) {
        return users_repository_1.usersRepository.update(id, { logged_in: false });
    }
}
exports.UserAuthService = UserAuthService;
exports.adminAuthService = new AdminAuthService();
exports.userAuthService = new UserAuthService();

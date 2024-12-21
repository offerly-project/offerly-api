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
const ejs_1 = __importDefault(require("ejs"));
const path_1 = __importDefault(require("path"));
const env_1 = require("../configs/env");
const errors_1 = require("../errors/errors");
const admins_repository_1 = require("../repositories/admins.repository");
const users_repository_1 = require("../repositories/users.repository");
const utils_1 = require("../utils/utils");
const mail_service_1 = require("./mail.service");
const otp_service_1 = require("./otp.service");
class AdminAuthService {
    login(username, password) {
        return __awaiter(this, void 0, void 0, function* () {
            const admin = yield admins_repository_1.adminsRepository.findOneByUsername(username);
            if (!admin) {
                throw new errors_1.NotFoundError("User not found");
            }
            const validPassword = yield (0, utils_1.validatePassword)(password, admin.password);
            if (!validPassword) {
                throw new errors_1.BadRequestError("Incorrect password");
            }
            const token = yield (0, utils_1.generateToken)(admin._id.toString(), "admin");
            return { token, admin: admin.username };
        });
    }
}
exports.AdminAuthService = AdminAuthService;
class UserAuthService {
    login(email, password) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield users_repository_1.usersRepository.findByEmail(email);
            if (!user) {
                throw new errors_1.NotFoundError("User not found");
            }
            const validPassword = yield (0, utils_1.validatePassword)(password, user.password);
            if (!validPassword) {
                throw new errors_1.BadRequestError("Incorrect password");
            }
            const token = yield (0, utils_1.generateToken)(user._id.toString(), "user");
            return {
                token,
                user: {
                    email: user.email,
                    full_name: user.full_name,
                    favorites: user.favorites,
                },
            };
        });
    }
    forgotPassword(email) {
        return __awaiter(this, void 0, void 0, function* () {
            const otp = otp_service_1.otpService.sendOtp(email);
            if (otp.code === null) {
                throw new errors_1.BadRequestError(`You can request for OTP only after ${otp.timer} milliseconds of the request`);
            }
            const html = yield ejs_1.default.renderFile(path_1.default.join(__dirname, "../templates/otp.ejs"), { otp: otp.code });
            mail_service_1.mailService.sendMail(email, "Password Reset OTP", html);
            return otp;
        });
    }
    changePassword(id, password) {
        return __awaiter(this, void 0, void 0, function* () {
            const hash = yield bcrypt_1.default.hash(password, +env_1.env.SALT_ROUNDS);
            yield users_repository_1.usersRepository.updatePassword(id, hash);
        });
    }
}
exports.UserAuthService = UserAuthService;
exports.adminAuthService = new AdminAuthService();
exports.userAuthService = new UserAuthService();

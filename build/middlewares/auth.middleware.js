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
exports.authorizeWithActions = exports.authorizeUserWithActions = exports.authorizeAdminWithActions = exports.authorize = exports.customAuthorization = exports.authorizeGuest = exports.authorizeUser = exports.authorizeAdmin = void 0;
const moment_1 = __importDefault(require("moment"));
const errors_1 = require("../errors/errors");
const errors_codes_1 = require("../errors/errors.codes");
const utils_1 = require("../utils/utils");
const _authorize = (roles, sources) => {
    return (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const authHeader = req.headers.authorization;
            if (!authHeader) {
                next(new errors_1.InternalServerError("Authorization header is missing", errors_codes_1.ErrorCodes.AUTH_HEADER_MISSING));
                return;
            }
            const token = authHeader && authHeader.split(" ")[1];
            if (!token) {
                next(new errors_1.InternalServerError("Token is missing", errors_codes_1.ErrorCodes.AUTH_TOKEN_MISSING));
                return;
            }
            const userData = yield (0, utils_1.verifyToken)(token);
            console.log(userData.iat);
            if (userData.iat && +userData.iat < (0, moment_1.default)().subtract(1, "days").unix()) {
                throw new errors_1.UnauthorizedError("Token has expired", errors_codes_1.ErrorCodes.UNAUTHORIZED);
            }
            req.user = userData;
            if (roles && !roles.includes(userData.role)) {
                throw new errors_1.UnauthorizedError("You are not authorized to access this resource", errors_codes_1.ErrorCodes.UNAUTHORIZED);
            }
            if (!sources.includes(userData.source)) {
                throw new errors_1.UnauthorizedError("You are not authorized to access this resource with this token", errors_codes_1.ErrorCodes.UNAUTHORIZED);
            }
            next();
            return;
        }
        catch (e) {
            next(e);
        }
    });
};
exports.authorizeAdmin = _authorize(["admin"], ["login"]);
exports.authorizeUser = _authorize(["user"], ["login"]);
exports.authorizeGuest = _authorize(["guest"], ["login"]);
const customAuthorization = (roles) => {
    return _authorize(roles, ["login"]);
};
exports.customAuthorization = customAuthorization;
exports.authorize = _authorize(["admin", "user"], ["login"]);
const authorizeAdminWithActions = (sources) => {
    return _authorize(["admin"], sources);
};
exports.authorizeAdminWithActions = authorizeAdminWithActions;
const authorizeUserWithActions = (sources) => {
    return _authorize(["user"], sources);
};
exports.authorizeUserWithActions = authorizeUserWithActions;
const authorizeWithActions = (sources) => {
    return _authorize(["admin", "user"], sources);
};
exports.authorizeWithActions = authorizeWithActions;

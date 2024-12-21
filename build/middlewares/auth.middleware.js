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
exports.authorize = exports.authorizeUser = exports.authorizeAdmin = void 0;
const errors_1 = require("../errors/errors");
const utils_1 = require("../utils/utils");
const _authorize = (roles) => {
    return (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        const authHeader = req.headers.authorization;
        if (!authHeader) {
            next(new errors_1.UnauthorizedError("Authorization header is missing"));
            return;
        }
        const token = authHeader && authHeader.split(" ")[1];
        if (!token) {
            next(new errors_1.UnauthorizedError("Token is missing"));
            return;
        }
        const userData = yield (0, utils_1.verifyToken)(token);
        if (roles && !roles.includes(userData.role)) {
            throw new errors_1.UnauthorizedError("You are not authorized to access this resource");
        }
        req.user = userData;
        next();
    });
};
exports.authorizeAdmin = _authorize(["admin"]);
exports.authorizeUser = _authorize(["user"]);
exports.authorize = _authorize(["admin", "user"]);

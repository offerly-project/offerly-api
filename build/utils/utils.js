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
exports.generateToken = exports.verifyToken = exports.languageSearchQuery = exports.validatePassword = exports.transformDocsResponse = exports.renameDocsObjectIdField = exports.removeUndefinedValuesFromObject = exports.validateRequest = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const env_1 = require("../configs/env");
const errors_1 = require("../errors/errors");
const validateRequest = (schema) => (req, res, next) => {
    schema
        .parseAsync(req)
        .then(() => next())
        .catch((err) => {
        next(new errors_1.ZodFriendlyError(err));
    });
};
exports.validateRequest = validateRequest;
const removeUndefinedValuesFromObject = (obj) => {
    Object.keys(obj).forEach((key) => {
        const value = obj[key];
        if (value && typeof value === "object" && !Array.isArray(value)) {
            (0, exports.removeUndefinedValuesFromObject)(value);
        }
        if (value === undefined) {
            delete obj[key];
        }
    });
    return obj;
};
exports.removeUndefinedValuesFromObject = removeUndefinedValuesFromObject;
const renameDocsObjectIdField = (docs) => {
    const renameId = (doc) => {
        doc.id = doc._id;
        delete doc._id;
        return doc;
    };
    if (Array.isArray(docs)) {
        return docs.map(renameId);
    }
    return renameId(docs);
};
exports.renameDocsObjectIdField = renameDocsObjectIdField;
const transformDocsResponse = (docs) => {
    const transform = (doc) => {
        if (doc && typeof doc === "object") {
            if (doc._id) {
                doc.id = doc._id.toString();
                delete doc._id;
            }
            Object.keys(doc).forEach((key) => {
                if (typeof doc[key] === "object" && doc[key] !== null) {
                    doc[key] = transform(doc[key]);
                }
            });
        }
        return doc;
    };
    if (Array.isArray(docs)) {
        return docs.map(transform);
    }
    return transform(docs);
};
exports.transformDocsResponse = transformDocsResponse;
const validatePassword = (password, hash) => __awaiter(void 0, void 0, void 0, function* () {
    return bcrypt_1.default.compare(password, hash);
});
exports.validatePassword = validatePassword;
const languageSearchQuery = (key, value) => ({
    $or: [{ [`${key}.en`]: value.en }, { [`${key}.ar`]: value.ar }],
});
exports.languageSearchQuery = languageSearchQuery;
const verifyToken = (token) => {
    return new Promise((resolve, reject) => {
        jsonwebtoken_1.default.verify(token, env_1.env.PRIVATE_KEY, (err, decoded) => {
            if (err) {
                reject(new errors_1.InternalServerError("failed to validate token"));
            }
            if (decoded)
                resolve(decoded);
        });
    });
};
exports.verifyToken = verifyToken;
const generateToken = (id, role, options = {}) => {
    return new Promise((resolve, reject) => {
        jsonwebtoken_1.default.sign({ id, role }, env_1.env.PRIVATE_KEY, options, ((err, token) => {
            if (err || !token) {
                reject(new errors_1.InternalServerError("failed to generate token"));
            }
            if (token)
                resolve(token);
        }));
    });
};
exports.generateToken = generateToken;

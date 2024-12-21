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
exports.imageUploadMiddleware = void 0;
const formidable_1 = __importDefault(require("formidable"));
const fs_1 = __importDefault(require("fs"));
const http_status_codes_1 = require("http-status-codes");
const path_1 = __importDefault(require("path"));
const image_builder_1 = require("../builders/image.builder");
const env_1 = require("../configs/env");
const errors_1 = require("../errors/errors");
const imageUploadMiddleware = (options) => (req, res, next) => {
    try {
        const { allowCustomDimensions, allowedPaths } = options;
        const form = new formidable_1.default.IncomingForm();
        form.parse(req, (err, fields, files) => __awaiter(void 0, void 0, void 0, function* () {
            if (err) {
                throw err;
            }
            const payload = Object.assign(Object.assign({}, files), fields);
            if (!payload.image) {
                next(new errors_1.BadRequestError("Image is required"));
                return;
            }
            if (!payload.path) {
                next(new errors_1.BadRequestError("Path is required"));
                return;
            }
            if (allowedPaths &&
                allowedPaths.length !== 0 &&
                !allowedPaths.some((path) => payload.path.startsWith(path))) {
                next(new errors_1.BadRequestError("Invalid Path"));
                return;
            }
            if (payload.dims && !allowCustomDimensions) {
                next(new errors_1.BadRequestError("Custom dimensions are not allowed"));
                return;
            }
            const oldPath = payload.image.filepath;
            const targetPath = path_1.default.join(env_1.env.UPLOADS_DIR, payload.path);
            if (!oldPath) {
                next(new errors_1.BadRequestError("File not uploaded"));
                return;
            }
            const imageBuffer = fs_1.default.readFileSync(oldPath);
            const builder = new image_builder_1.ImageBuilder(imageBuffer);
            if (payload.dims) {
                builder.withDimensions(payload.dims);
            }
            yield builder.build().toFile(targetPath);
            res
                .status(http_status_codes_1.StatusCodes.OK)
                .send({ message: "Image uploaded successfully" });
        }));
    }
    catch (e) {
        next(e);
    }
};
exports.imageUploadMiddleware = imageUploadMiddleware;

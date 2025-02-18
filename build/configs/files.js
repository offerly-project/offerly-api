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
exports.createUploadDirectories = exports.UPLOAD_DIRECTORIES = void 0;
exports.UPLOAD_DIRECTORIES = ["/banks", "/offers", "/cards"];
const fs_1 = __importDefault(require("fs"));
const env_1 = require("./env");
const createUploadDirectories = () => __awaiter(void 0, void 0, void 0, function* () {
    for (const directoryName of exports.UPLOAD_DIRECTORIES) {
        const path = `${env_1.env.UPLOADS_DIR}${directoryName}`;
        yield fs_1.default.promises.mkdir(path, {
            recursive: true,
        });
        console.log(`Directory ${path} created`);
    }
});
exports.createUploadDirectories = createUploadDirectories;

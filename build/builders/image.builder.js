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
exports.ImageBuilder = void 0;
const sharp_1 = __importDefault(require("sharp"));
class ImageBuilder {
    constructor(buffer) {
        this._image = (0, sharp_1.default)(buffer);
    }
    withDimensions(dims, fit) {
        return __awaiter(this, void 0, void 0, function* () {
            const [width, height] = dims.split("x").map(Number);
            if (isNaN(width) || isNaN(height)) {
                throw new Error("Invalid dimensions");
            }
            if (fit) {
                this._image.resize(width, height, {
                    fit: "contain",
                    background: {
                        r: 0,
                        g: 0,
                        b: 0,
                        alpha: 0,
                    },
                });
            }
            else {
                this._image.resize(width, height);
            }
        });
    }
    build() {
        return this._image.withMetadata().toFormat("png", { quality: 90 });
    }
}
exports.ImageBuilder = ImageBuilder;

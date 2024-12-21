"use strict";
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
    withDimensions(dims) {
        const [width, height] = dims.split("x").map(Number);
        if (isNaN(width) || isNaN(height)) {
            throw new Error("Invalid dimensions");
        }
        this._image.resize(width, height);
    }
    build() {
        return this._image.withMetadata().toFormat("png", { quality: 90 });
    }
}
exports.ImageBuilder = ImageBuilder;

import sharp, { Sharp } from "sharp";
import { ImageDimensions } from "../middlewares/uploads.middleware";

export class ImageBuilder {
	private _image: Sharp;
	constructor(buffer: Buffer) {
		this._image = sharp(buffer);
	}
	withDimensions(dims: ImageDimensions) {
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

import sharp, { Sharp } from "sharp";
import { ImageDimensions } from "../middlewares/uploads.middleware";

export class ImageBuilder {
	private _image: Sharp;
	constructor(buffer: Buffer) {
		this._image = sharp(buffer);
	}

	async withDimensions(dims: ImageDimensions) {
		const [width, height] = dims.split("x").map(Number);
		if (isNaN(width) || isNaN(height)) {
			throw new Error("Invalid dimensions");
		}
		const dominant = await this._image.stats();
		this._image.resize(width, height, {
			fit: "contain",
			background: {
				r: dominant.dominant.r,
				g: dominant.dominant.g,
				b: dominant.dominant.b,
				alpha: 1,
			},
		});
	}

	build() {
		return this._image.withMetadata().toFormat("png", { quality: 90 });
	}
}

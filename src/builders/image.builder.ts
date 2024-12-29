import sharp, { Sharp } from "sharp";
import { ImageDimensions } from "../middlewares/uploads.middleware";

export class ImageBuilder {
	private _image: Sharp;
	constructor(buffer: Buffer) {
		this._image = sharp(buffer);
	}

	async withDimensions(dims: ImageDimensions, fit: boolean) {
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
		} else {
			this._image.resize(width, height);
		}
	}

	build() {
		return this._image.withMetadata().toFormat("png", { quality: 90 });
	}
}

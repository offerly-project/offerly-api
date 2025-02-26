import sharp, { Color, Sharp } from "sharp";
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

		// Get image metadata to check for transparency (alpha channel)
		const metadata = await this._image.metadata();
		const hasAlpha = metadata.hasAlpha;

		// Default background color is white if no transparency is found
		const backgroundColor = hasAlpha
			? metadata.background
			: { r: 255, g: 255, b: 255, alpha: 1 };

		if (fit) {
			this._image.resize(width, height, {
				fit: "contain",
				background: backgroundColor as Color,
			});
		} else {
			this._image.resize(width, height, {
				background: backgroundColor as Color,
			});
		}
	}

	build() {
		return this._image.withMetadata().toFormat("png", { quality: 90 });
	}
}

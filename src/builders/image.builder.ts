import sharp, { Sharp } from "sharp";
import { ImageDimensions } from "../middlewares/uploads.middleware";
//@ts-ignore
import ColorThief from "colorthief"; // You'll need to install this library: npm install colorthief

export class ImageBuilder {
	private _image: Sharp;
	constructor(buffer: Buffer) {
		this._image = sharp(buffer);
	}

	// Helper function to get dominant color
	async getDominantColor() {
		const dominantColor = await new Promise<any>((resolve, reject) => {
			//@ts-ignore
			ColorThief.getColor(this._image, (err, color) => {
				if (err) reject(err);
				resolve(color);
			});
		});
		return dominantColor || { r: 255, g: 255, b: 255 }; // Default to white if no dominant color found
	}

	async withDimensions(dims: ImageDimensions, fit: boolean) {
		const [width, height] = dims.split("x").map(Number);
		if (isNaN(width) || isNaN(height)) {
			throw new Error("Invalid dimensions");
		}

		// Get image metadata to check for transparency (alpha channel)
		const metadata = await this._image.metadata();
		const hasAlpha = metadata.hasAlpha;

		// Default to white if the image has no transparent background
		let backgroundColor = { r: 255, g: 255, b: 255 };

		// If the image has transparency, get the dominant color of the image
		if (hasAlpha) {
			backgroundColor = await this.getDominantColor();
		}

		if (fit) {
			this._image.resize(width, height, {
				fit: "contain",
				background: backgroundColor,
			});
		} else {
			this._image.resize(width, height, {
				background: backgroundColor,
			});
		}
	}

	build() {
		return this._image.withMetadata().toFormat("png", { quality: 90 });
	}
}

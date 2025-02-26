import sharp, { Sharp } from "sharp";
import { ImageDimensions } from "../middlewares/uploads.middleware";

export class ImageBuilder {
	private _image: Sharp;

	constructor(buffer: Buffer) {
		this._image = sharp(buffer);
	}

	// Helper function to calculate dominant color
	async getDominantColor(): Promise<{ r: number; g: number; b: number }> {
		const { data, info } = await this._image
			.raw()
			.toBuffer({ resolveWithObject: true });
		const pixelCount = info.width * info.height;

		// Create a map to count color occurrences
		const colorMap = new Map<string, number>();

		for (let i = 0; i < pixelCount; i++) {
			const r = data[i * 3];
			const g = data[i * 3 + 1];
			const b = data[i * 3 + 2];
			const colorKey = `${r},${g},${b}`;

			colorMap.set(colorKey, (colorMap.get(colorKey) || 0) + 1);
		}

		// Find the most frequent color
		let dominantColor = { r: 255, g: 255, b: 255 }; // Default to white
		let maxCount = 0;

		colorMap.forEach((count, colorKey) => {
			if (count > maxCount) {
				maxCount = count;
				const [r, g, b] = colorKey.split(",").map(Number);
				dominantColor = { r, g, b };
			}
		});

		return dominantColor;
	}

	async withDimensions(dims: ImageDimensions, fit: boolean) {
		const [width, height] = dims.split("x").map(Number);
		if (isNaN(width) || isNaN(height)) {
			throw new Error("Invalid dimensions");
		}

		// Get image metadata to check for transparency (alpha channel)
		const metadata = await this._image.metadata();
		const hasAlpha = metadata.hasAlpha;

		// Default to white if no transparency
		let backgroundColor = { r: 255, g: 255, b: 255 };

		// If the image has transparency, get the dominant color
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

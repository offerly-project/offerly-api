import sharp from "sharp";
import { ImageDimensions } from "../controllers/upload.controller";

type ImageSaveParams = {
	buffer: Buffer;
	path: string;
	dims?: ImageDimensions;
};

export class ImageUploadService {
	async save(params: ImageSaveParams) {
		const { buffer, path, dims } = params;

		const sharpImage = sharp(buffer);
		if (dims) {
			const [width, height] = dims.split("x").map(Number);
			if (isNaN(width) || isNaN(height)) {
				throw new Error("Invalid dimensions");
			}
			sharpImage.resize(width, height);
		}

		await sharpImage
			.withMetadata()
			.toFormat("png", { quality: 90 })
			.toFile(path);
	}
}

export const imageUploadService = new ImageUploadService();

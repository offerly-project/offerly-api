import sharp from "sharp";
import { ImageDimensions } from "../controllers/upload.controller";

type ImageSaveParams = {
	buffer: Buffer;
	path: string;
	dims?: ImageDimensions;
};

export class ImageUploadService {
	save(params: ImageSaveParams) {
		return new Promise<void>((resolve, reject) => {
			const { buffer, path, dims } = params;

			const sharpImage = sharp(buffer);
			if (dims) {
				const [width, height] = dims.split("x").map(Number);
				sharpImage.resize(width, height);
			}
			sharpImage
				.withMetadata()
				.toFormat("png", { quality: 90 })
				.toFile(path)
				.then(() => resolve())
				.catch(reject);
		});
	}
}

export const imageUploadService = new ImageUploadService();

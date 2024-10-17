import { ImageUploadPayload } from "../controllers/upload.controller";
import { BadRequestError } from "../errors/errors";

export const validateImageUploadPayload = (
	payload: ImageUploadPayload
): void => {
	if (!payload.image) {
		throw new BadRequestError("File is required");
	}

	if (!payload.path) {
		throw new BadRequestError("File Path is required");
	}
	if (payload.dims) {
		const [width, height] = payload.dims.split("x").map(Number);
		if (isNaN(width) || isNaN(height)) {
			throw new BadRequestError("Invalid dimensions");
		}
	}
};

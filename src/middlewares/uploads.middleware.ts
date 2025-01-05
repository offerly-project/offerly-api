import { NextFunction, Request, Response } from "express";
import formidable from "formidable";
import fs from "fs";
import { StatusCodes } from "http-status-codes";
import path from "path";
import { ImageBuilder } from "../builders/image.builder";
import { env } from "../configs/env";
import { UploadDirectory } from "../configs/files";
import { BadRequestError, InternalServerError } from "../errors/errors";
import { ErrorCodes } from "../errors/errors.codes";

export type ImageDimensions = `${string}x${string}`;

export type ImageUploadPayload = {
	image: formidable.File;
	path: string;
	dims?: ImageDimensions;
	fit?: boolean;
};

type ImageUploadMiddlwareOptions = {
	allowCustomDimensions?: boolean;
	allowedPaths?: UploadDirectory[];
};

export const imageUploadMiddleware =
	(options: ImageUploadMiddlwareOptions) =>
	(req: Request, res: Response, next: NextFunction) => {
		try {
			const { allowCustomDimensions, allowedPaths } = options;
			const form = new formidable.IncomingForm();

			form.parse(req, async (err, fields, files) => {
				if (err) {
					throw err;
				}
				const payload = {
					...files,
					...fields,
				} as unknown as ImageUploadPayload;

				if (!payload.image) {
					next(
						new BadRequestError("Image is required", ErrorCodes.IMAGE_REQUIRED)
					);
					return;
				}

				if (!payload.path) {
					next(
						new BadRequestError("Path is required", ErrorCodes.PATH_REQUIRED)
					);
					return;
				}

				if (
					allowedPaths &&
					allowedPaths.length !== 0 &&
					!allowedPaths.some((path) => payload.path.startsWith(path))
				) {
					next(new BadRequestError("Invalid Path", ErrorCodes.INVALID_PATH));
					return;
				}
				if (payload.dims && !allowCustomDimensions) {
					next(
						new BadRequestError(
							"Custom dimensions are not allowed",
							ErrorCodes.CUSTOM_DIMENSIONS_NOT_ALLOWED
						)
					);
					return;
				}
				const oldPath = payload.image.filepath;
				const targetPath = path.join(env.UPLOADS_DIR, payload.path);
				if (!oldPath) {
					next(
						new InternalServerError(
							"File not uploaded",
							ErrorCodes.FILE_NOT_UPLOADED
						)
					);
					return;
				}
				const imageBuffer = fs.readFileSync(oldPath);
				const builder = new ImageBuilder(imageBuffer);
				if (payload.dims) {
					await builder.withDimensions(payload.dims, payload.fit || false);
				}
				await builder.build().toFile(targetPath);
				res
					.status(StatusCodes.OK)
					.send({ message: "Image uploaded successfully" });
			});
		} catch (e) {
			next(e);
		}
	};

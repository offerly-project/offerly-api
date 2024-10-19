import { NextFunction, Request, Response } from "express";
import formidable from "formidable";
import fs from "fs";
import { StatusCodes } from "http-status-codes";
import path from "path";
import { ImageBuilder } from "../builders/image.builder";
import { env } from "../configs/env";
import { UploadDirectory } from "../configs/files";
import { BadRequestError } from "../errors/errors";

export type ImageDimensions = `${string}x${string}`;

export type ImageUploadPayload = {
	image: formidable.File;
	path: string;
	dims?: ImageDimensions;
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

				if (
					allowedPaths &&
					allowedPaths.length !== 0 &&
					!allowedPaths.some((path) => payload.path.startsWith(path))
				) {
					next(new BadRequestError("Invalid Path"));
					return;
				}
				if (payload.dims && !allowCustomDimensions) {
					next(new BadRequestError("Custom dimensions are not allowed"));
					return;
				}
				const oldPath = payload.image.filepath;
				const targetPath = path.join(__dirname, env.DATA_DIR, payload.path);
				const imageBuffer = fs.readFileSync(oldPath);
				const builder = new ImageBuilder(imageBuffer);
				if (payload.dims) {
					builder.withDimensions(payload.dims);
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
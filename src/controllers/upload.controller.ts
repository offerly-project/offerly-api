import { NextFunction, Request, Response } from "express";
import formidable from "formidable";
import fs from "fs";
import { StatusCodes } from "http-status-codes";
import path from "path";
import { env } from "../configs/env";
import { imageUploadService } from "../services/upload.services";
import { validateImageUploadPayload } from "../validators/uploads.validators";

export type ImageDimensions = `${string}x${string}`;

export type ImageUploadPayload = {
	image: formidable.File;
	path: string;
	dims?: ImageDimensions;
};

export const imageUploadHandler = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	try {
		const form = new formidable.IncomingForm();

		form.parse(req, async (err, fields, files) => {
			try {
				if (err) {
					throw err;
				}
				const payload = {
					...files,
					...fields,
				} as unknown as ImageUploadPayload;

				validateImageUploadPayload(payload);

				const oldPath = payload.image.filepath;
				const targetPath = path.join(__dirname, env.DATA_DIR, payload.path);
				const imageBuffer = fs.readFileSync(oldPath);

				await imageUploadService.save({
					buffer: imageBuffer,
					path: targetPath,
					dims: payload.dims,
				});

				res
					.status(StatusCodes.OK)
					.send({ message: "Image uploaded successfully" });
			} catch (e) {
				next(e);
			}
		});
	} catch (e) {
		next(e);
	}
};

export const uploadsController = {
	imageUploadHandler,
};

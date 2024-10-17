import { NextFunction, Request, Response } from "express";
import formidable from "formidable";

export const uploadHandler = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	try {
		const form = new formidable.IncomingForm();

		form.parse(req, (err, fields, files) => {});

		res.status(200).json({ message: "File uploaded successfully" });
	} catch (e) {
		next(e);
	}
};

import { NextFunction, Request, Response } from "express";
import { CustomError } from "../errors/errors";

export const errorsMiddleware = (
	err: Error,
	req: Request,
	res: Response,
	next: NextFunction
) => {
	if (err instanceof CustomError) {
		console.error(err.toString());
		res.status(err.status).json(err.toString());
	} else {
		console.error(err);
		res.status(500).json({
			status: 500,
			message: "Internal server error",
		});
	}
};

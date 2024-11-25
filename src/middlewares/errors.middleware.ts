import { BSONError } from "bson";
import { NextFunction, Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { CustomError } from "../errors/errors";

export const errorsMiddleware = (
	err: Error,
	req: Request,
	res: Response,
	next: NextFunction
) => {
	console.error(err.toString());
	if (err instanceof CustomError) {
		res.status(err.status).send(err.toString());
	} else if (BSONError.isBSONError(err)) {
		res.status(StatusCodes.INTERNAL_SERVER_ERROR).send({
			code: StatusCodes.INTERNAL_SERVER_ERROR,
			message: "Database error",
		});
	} else {
		res.status(StatusCodes.INTERNAL_SERVER_ERROR).send({
			status: StatusCodes.INTERNAL_SERVER_ERROR,
			message: "Internal server error",
		});
	}
};

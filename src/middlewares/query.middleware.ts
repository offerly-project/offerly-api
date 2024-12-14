import { NextFunction, Request, Response } from "express";

export const queryMiddleware = (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	Object.entries(req.query).forEach(([key, value]) => {
		if (typeof value === "string") req.query[key] = value.replace("and", "&");
	});
	next();
};

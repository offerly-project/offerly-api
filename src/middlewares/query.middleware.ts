import { NextFunction, Request, Response } from "express";

export const queryMiddleware = (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	const decodedQuery = Object.entries(req.query).reduce((acc, [key, value]) => {
		acc[key] = decodeURIComponent(value as string);
		return acc;
	}, {} as Record<string, string>);

	req.query = decodedQuery;

	next();
};

import { NextFunction, Request, Response } from "express";
import { ZodFriendlyError } from "../errors/errors";

export const validateRequest =
	(schema: Zod.Schema) => (req: Request, res: Response, next: NextFunction) => {
		console.log(req);

		schema
			.parseAsync(req)
			.then(() => next())
			.catch((err) => {
				next(new ZodFriendlyError(err));
			});
	};

export const removeUndefinedValuesFromObject = <T extends Record<string, any>>(
	obj: T
): T => {
	Object.keys(obj).forEach((key) => obj[key] === undefined && delete obj[key]);
	return obj as T;
};

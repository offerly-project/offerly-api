import { NextFunction, Request, Response } from "express";
import { WithId } from "mongodb";
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

export const documentToClient = <T = any>(obj: WithId<T>): T => {
	//@ts-ignore
	obj.id = obj._id.toString();
	//@ts-ignore
	delete obj._id;
	return obj as T;
};

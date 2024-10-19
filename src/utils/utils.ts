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
	const convert = (item: any): any => {
		if (Array.isArray(item)) {
			return item.map(convert);
		} else if (item && typeof item === "object") {
			if (item._id) {
				item.id = item._id.toString();
				delete item._id;
			}

			for (const key in item) {
				if (item.hasOwnProperty(key)) {
					item[key] = convert(item[key]);
				}
			}
		}
		return item;
	};

	return convert(obj) as T;
};

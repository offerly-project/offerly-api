import { NextFunction, Request, Response } from "express";
import { Document } from "mongodb";
import { ZodFriendlyError } from "../errors/errors";

export const validateRequest =
	(schema: Zod.Schema) => (req: Request, res: Response, next: NextFunction) => {
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

export const renameDocsObjectIdField = (docs: Document[] | Document) => {
	const renameId = (doc: Document) => {
		doc.id = doc._id;
		delete doc._id;
		return doc;
	};

	if (Array.isArray(docs)) {
		return docs.map(renameId);
	}

	return renameId(docs);
};

export const transformDocsResponse = (docs: Document[] | Document): any => {
	const transform = (doc: any) => {
		if (doc && typeof doc === "object") {
			if (doc._id) {
				doc.id = doc._id.toString();
				delete doc._id;
			}

			Object.keys(doc).forEach((key) => {
				if (typeof doc[key] === "object" && doc[key] !== null) {
					doc[key] = transform(doc[key]);
				}
			});
		}
		return doc;
	};

	if (Array.isArray(docs)) {
		return docs.map(transform);
	}

	return transform(docs);
};

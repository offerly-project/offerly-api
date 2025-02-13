import bcrypt from "bcrypt";
import { NextFunction, Request, Response } from "express";
import jwt, { SignOptions } from "jsonwebtoken";
import { Document } from "mongodb";
import { env } from "../configs/env";
import { InternalServerError, ZodFriendlyError } from "../errors/errors";
import { JwtUserPayload, Translation, UserRole } from "../ts/global";

export const validateRequest =
	(schema: Zod.Schema) =>
	(req: Request<any, any, any, any>, res: Response, next: NextFunction) => {
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
	Object.keys(obj).forEach((key) => {
		const value = obj[key];
		if (value && typeof value === "object" && !Array.isArray(value)) {
			removeUndefinedValuesFromObject(value);
		}
		if (value === undefined) {
			delete obj[key];
		}
	});
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

export const validatePassword = async (
	password: string,
	hash: string
): Promise<boolean> => {
	return bcrypt.compare(password, hash);
};

export const languageSearchQuery = (key: string, value: Translation) => ({
	$or: [{ [`${key}.en`]: value.en }, { [`${key}.ar`]: value.ar }],
});

export const verifyToken = (token: string): Promise<JwtUserPayload> => {
	return new Promise((resolve, reject) => {
		jwt.verify(token, env.PRIVATE_KEY, (err, decoded) => {
			if (err) {
				reject(new InternalServerError("failed to validate token"));
			}
			if (decoded) resolve(decoded as JwtUserPayload);
		});
	});
};

export const jwtSources = ["password-reset", "login"] as const;

export type JWTSource = (typeof jwtSources)[number];

export const generateToken = (
	id: string,
	role: UserRole,
	source: JWTSource,
	options: SignOptions = {}
): Promise<string> => {
	return new Promise((resolve, reject) => {
		jwt.sign({ id, role, source }, env.PRIVATE_KEY, options, ((err, token) => {
			if (err || !token) {
				reject(new InternalServerError("failed to generate token"));
			}
			if (token) resolve(token);
		}) as jwt.SignCallback);
	});
};

export const getSortDirectionNumber = (direction: "asc" | "desc") =>
	direction === "asc" ? 1 : -1;

export const sleep = (s: number) =>
	new Promise((resolve) => setTimeout(resolve, s * 1000));

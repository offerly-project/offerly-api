import { NextFunction, Request, Response } from "express";
import { UnauthorizedError } from "../errors/errors";
import { UserRole } from "../ts/global";
import { verifyToken } from "../utils/utils";

const _authorize = (roles: UserRole[]) => {
	return async (
		req: Request<any, any, any, any>,
		res: Response,
		next: NextFunction
	) => {
		const authHeader = req.headers.authorization;

		if (!authHeader) {
			next(new UnauthorizedError("Authorization header is missing"));
			return;
		}

		const token = authHeader && authHeader.split(" ")[1];

		if (!token) {
			next(new UnauthorizedError("Token is missing"));
			return;
		}

		const userData = await verifyToken(token!);

		if (roles && !roles.includes(userData.role)) {
			throw new UnauthorizedError(
				"You are not authorized to access this resource"
			);
		}

		req.user = userData;

		next();
	};
};

export const authorizeAdmin = _authorize(["admin"]);

export const authorizeUser = _authorize(["user"]);

export const authorize = _authorize(["admin", "user"]);

import { NextFunction, Request, Response } from "express";
import { InternalServerError, UnauthorizedError } from "../errors/errors";
import { ErrorCodes } from "../errors/errors.codes";
import { UserRole } from "../ts/global";
import { JWTSource, verifyToken } from "../utils/utils";

const _authorize = (roles: UserRole[], sources: JWTSource[]) => {
	return async (
		req: Request<any, any, any, any>,
		res: Response,
		next: NextFunction
	) => {
		try {
			const authHeader = req.headers.authorization;

			if (!authHeader) {
				next(
					new InternalServerError(
						"Authorization header is missing",
						ErrorCodes.AUTH_HEADER_MISSING
					)
				);
				return;
			}

			const token = authHeader && authHeader.split(" ")[1];

			if (!token) {
				next(
					new InternalServerError(
						"Token is missing",
						ErrorCodes.AUTH_TOKEN_MISSING
					)
				);
				return;
			}

			const userData = await verifyToken(token!);

			req.user = userData;
			if (roles && !roles.includes(userData.role)) {
				throw new UnauthorizedError(
					"You are not authorized to access this resource",
					ErrorCodes.UNAUTHORIZED
				);
			}

			if (!sources.includes(userData.source)) {
				throw new UnauthorizedError(
					"You are not authorized to access this resource with this token",
					ErrorCodes.UNAUTHORIZED
				);
			}
			next();
			return;
		} catch (e) {
			next(e);
		}
	};
};

export const authorizeAdmin = _authorize(["admin"], ["login"]);

export const authorizeUser = _authorize(["user"], ["login"]);

export const authorizeGuest = _authorize(["guest"], ["login"]);

export const authorize = _authorize(["admin", "user"], ["login"]);

export const authorizeAdminWithActions = (sources: JWTSource[]) => {
	return _authorize(["admin"], sources);
};

export const authorizeUserWithActions = (sources: JWTSource[]) => {
	return _authorize(["user"], sources);
};

export const authorizeWithActions = (sources: JWTSource[]) => {
	return _authorize(["admin", "user"], sources);
};

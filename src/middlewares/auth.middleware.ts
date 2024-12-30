import { NextFunction, Request, Response } from "express";
import { UnauthorizedError } from "../errors/errors";
import { UserRole } from "../ts/global";
import { JWTPermissions, verifyToken } from "../utils/utils";

const _authorize = (roles: UserRole[], permissions: JWTPermissions[]) => {
	return async (
		req: Request<any, any, any, any>,
		res: Response,
		next: NextFunction
	) => {
		try {
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

			req.user = userData;
			if (roles && !roles.includes(userData.role)) {
				throw new UnauthorizedError(
					"You are not authorized to access this resource"
				);
			}

			if (
				!(
					permissions.includes("all") ||
					permissions.some((permission) =>
						userData.permissions.includes(permission)
					)
				)
			) {
				throw new UnauthorizedError(
					"You are not authorized to access this resource"
				);
			}
			next();
			return;
		} catch (e) {
			next(e);
		}
	};
};

export const authorizeAdmin = _authorize(["admin"], ["all"]);

export const authorizeUser = _authorize(["user"], ["all"]);

export const authorize = _authorize(["admin", "user"], ["all"]);

export const authorizeAdminWithActions = (actions: JWTPermissions[]) => {
	return _authorize(["admin"], actions);
};

export const authorizeUserWithActions = (actions: JWTPermissions[]) => {
	return _authorize(["user"], actions);
};

export const authorizeWithActions = (actions: JWTPermissions[]) => {
	return _authorize(["admin", "user"], actions);
};

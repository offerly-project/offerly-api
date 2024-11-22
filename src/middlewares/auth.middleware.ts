import { NextFunction, Request, Response } from "express";
import { UnauthorizedError } from "../errors/errors";
import { UserRole } from "../ts/global";
import { verifyToken } from "../utils/utils";

const _authorize = (roles: UserRole[]) => {
	return async (req: Request, res: Response, next: NextFunction) => {
		const authHeader = req.headers.authorization;

		if (!authHeader) {
			throw new UnauthorizedError("Authorization header is missing");
		}

		const token = authHeader && authHeader.split(" ")[1];

		const userData = await verifyToken(token);

		if (roles && !roles.includes(userData.role)) {
			throw new UnauthorizedError(
				"You are not authorized to access this resource"
			);
		}

		req.user = userData;

		next();
	};
};

/**
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY3NDA2NWE4MTAyMzkwODRjMTgxNjczMCIsInJvbGUiOiJ1c2VyIiwiaWF0IjoxNzMyMjczNTg2fQ.1cTN4vP8qjO3mWwC6aM44cXlLpsETdfyoggd9BIQ7Uc"
 * 
 */

export const authorizeAdmin = _authorize(["admin"]);

export const authorizeUser = _authorize(["user"]);

export const authorize = _authorize(["admin", "user"]);

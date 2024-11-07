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

// eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY3MjhmYmE4MTg3ODcyZmM3MGYzODY2OSIsInJvbGUiOiJ1c2VyIiwiaWF0IjoxNzMwOTk1ODM2fQ.ksoyCsDeKKYBl_GfXGORLLvm7vPq0RGMLbCY4pMQ238

export const authorizeAdmin = _authorize(["admin"]);

export const authorizeUser = _authorize(["user"]);

export const authorize = _authorize(["admin", "user"]);

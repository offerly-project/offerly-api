import { NextFunction, Request, Response } from "express";
import { UserRole } from "../ts/users.types";
export type LoginRequestParams = {
	type: UserRole;
};

export type LoginRequestBody = {
	username: string;
	password: string;
};

const loginHandler = (
	req: Request<LoginRequestParams, {}, LoginRequestBody>,
	res: Response,
	next: NextFunction
) => {
	const { type } = req.params;
	const { username, password } = req.body;

	res.send(`Login with ${type} strategy`);
};

export const authController = {
	loginHandler,
};

import { NextFunction, Request, Response } from "express";
import { COOKIE_OPTIONS } from "../configs/options";
import { BadRequestError, NotFoundError } from "../errors/errors";
import { adminsRepository } from "../repositories/admins.repository";
import { authService } from "../services/auth.service";
import { UserRole } from "../ts/users.types";
export type LoginRequestParams = {
	type: UserRole;
};

export type LoginRequestBody = {
	username: string;
	password: string;
};

const adminLoginHandler = async (
	req: Request<LoginRequestParams, {}, LoginRequestBody>,
	res: Response,
	next: NextFunction
) => {
	const { type } = req.params;
	const { username, password } = req.body;

	const user = await adminsRepository.findAdminByUsername(username);
	if (!user) {
		next(new NotFoundError("user not found"));
		return;
	}
	const validPassword = await authService.validateLogin(
		password,
		user.password
	);
	console.log(validPassword);

	if (!validPassword) {
		next(new BadRequestError("incorrect password"));
		return;
	}
	const token = await authService.generateToken(user.username, type);

	res.cookie("jwt", token, COOKIE_OPTIONS).send({ message: "success" });
};

export const authController = {
	adminLoginHandler,
};

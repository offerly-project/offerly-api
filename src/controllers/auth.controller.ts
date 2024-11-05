import { NextFunction, Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { COOKIE_OPTIONS } from "../configs/options";
import { authService } from "../services/auth.service";
import {
	AdminLoginBodyData,
	UserForgotPasswordBodyData,
	UserLoginBodyData,
} from "../validators/auth.validators";

const adminLoginHandler = async (
	req: Request<{}, {}, AdminLoginBodyData>,
	res: Response,
	next: NextFunction
) => {
	const { username, password } = req.body;
	try {
		const { admin, token } = await authService.adminLogin(username, password);

		res.status(StatusCodes.OK).cookie("jwt", token, COOKIE_OPTIONS).send({
			message: "logged in",
			user: admin,
		});
	} catch (e) {
		next(e);
	}
};

const userLoginHandler = async (
	req: Request<{}, {}, UserLoginBodyData>,
	res: Response,
	next: NextFunction
) => {
	const { email, password } = req.body;
	try {
		const { token, user } = await authService.userLogin(email, password);

		res.status(StatusCodes.OK).cookie("jwt", token, COOKIE_OPTIONS).send({
			message: "logged in",
			user,
		});
	} catch (e) {
		next(e);
	}
};

const userForgotPasswordHandler = async (
	req: Request<{}, {}, UserForgotPasswordBodyData>,
	res: Response,
	next: NextFunction
) => {
	const { email } = req.body;
	try {
		await authService.forgotPassword(email);
		res.status(StatusCodes.OK).send({
			message: "Password reset link sent to your email",
		});
	} catch (e) {
		next(e);
	}
};

export const authController = {
	adminLoginHandler,
	userLoginHandler,
	userForgotPasswordHandler,
};

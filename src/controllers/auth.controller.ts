import { NextFunction, Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { adminAuthService, userAuthService } from "../services/auth.service";
import { generateToken } from "../utils/utils";
import {
	AdminLoginBodyData,
	UserForgotPasswordBodyData,
	UserLoginBodyData,
	UserResetPasswordBodyData,
} from "../validators/auth.validators";

const adminLoginHandler = async (
	req: Request<{}, {}, AdminLoginBodyData>,
	res: Response,
	next: NextFunction
) => {
	const { username, password } = req.body;
	try {
		const { admin, token } = await adminAuthService.login(username, password);

		res.status(StatusCodes.OK).send({
			message: "logged in",
			user: admin,
			token,
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
		const { token, user } = await userAuthService.login(email, password);

		res.status(StatusCodes.OK).send({
			message: "logged in",
			user,
			token,
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
		const otp = await userAuthService.forgotPassword(email);
		res.status(StatusCodes.OK).send({
			status: StatusCodes.OK,
			message: "Password reset link sent to your email",
			expiry: otp.expiry,
		});
	} catch (e) {
		next(e);
	}
};

const userResetPasswordHandler = async (
	req: Request<{}, {}, UserResetPasswordBodyData>,
	res: Response,
	next: NextFunction
) => {
	try {
		const { password } = req.body;
		const id = req.user.id;
		await userAuthService.changePassword(id, password);
		const token = await generateToken(id, "user");
		res.status(StatusCodes.OK).send({
			message: "Password reset successfully",
			token,
		});
	} catch (e) {
		next(e);
	}
};

export const authController = {
	adminLoginHandler,
	userLoginHandler,
	userForgotPasswordHandler,
	userResetPasswordHandler,
};

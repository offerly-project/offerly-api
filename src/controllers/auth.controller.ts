import { NextFunction, Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { BadRequestError, UnauthorizedError } from "../errors/errors";
import { adminAuthService, userAuthService } from "../services/auth.service";
import {
	AdminLoginBodyData,
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

const userResetPasswordHandler = async (
	req: Request<{}, {}, UserResetPasswordBodyData & { old_password?: string }>,
	res: Response,
	next: NextFunction
) => {
	try {
		const { new_password, old_password } = req.body;
		const { source, id } = req.user;

		if (source === "login") {
			if (!old_password) {
				throw new BadRequestError("Old password is required for this action");
			}
			await userAuthService.changePasswordWithOldPassword(
				id,
				old_password,
				new_password
			);
		} else if (source === "password-reset") {
			if (old_password) {
				throw new BadRequestError(
					"Old password should not be provided for this action"
				);
			}
			await userAuthService.changePassword(id, new_password);
		} else {
			throw new UnauthorizedError(
				"You do not have permission to reset the password"
			);
		}

		res.status(StatusCodes.OK).send({
			message: "Password reset successfully",
		});
	} catch (e) {
		next(e);
	}
};
export const authController = {
	adminLoginHandler,
	userLoginHandler,
	userResetPasswordHandler,
};

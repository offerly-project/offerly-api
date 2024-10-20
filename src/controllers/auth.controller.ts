import { NextFunction, Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { COOKIE_OPTIONS } from "../configs/options";
import { authService } from "../services/auth.service";
import { AdminLoginBodyData } from "../validators/auth.validators";

const adminLoginHandler = async (
	req: Request<{}, {}, AdminLoginBodyData>,
	res: Response,
	next: NextFunction
) => {
	const { username, password } = req.body;
	try {
		const token = await authService.adminLogin(username, password);

		res
			.status(StatusCodes.OK)
			.cookie("jwt", token, COOKIE_OPTIONS)
			.send({ message: "logged in" });
	} catch (e) {
		next(e);
	}
};

export const authController = {
	adminLoginHandler,
};

import { NextFunction, Request, Response } from "express";
import { COOKIE_OPTIONS } from "../configs/options";
import { AdminLoginBodyData } from "../schemas/auth.schemas";
import { authService } from "../services/auth.service";

const adminLoginHandler = async (
	req: Request<{}, {}, AdminLoginBodyData>,
	res: Response,
	next: NextFunction
) => {
	const { username, password } = req.body;
	try {
		const token = await authService.adminLogin(username, password);

		res.cookie("jwt", token, COOKIE_OPTIONS).send({ message: "logged in" });
	} catch (e) {
		next(e);
	}
};

export const authController = {
	adminLoginHandler,
};

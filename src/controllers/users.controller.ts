import { NextFunction, Request, Response } from "express";
import { usersService } from "../services/users.service";
import { SignupUserBodyData } from "../validators/users.validators";

const createUserHandler = async (
	req: Request<{}, {}, SignupUserBodyData>,
	res: Response,
	next: NextFunction
) => {
	try {
		const user = req.body;

		await usersService.signupUser(user);

		res.status(201).send({ message: "User created successfully" });
	} catch (e) {
		next(e);
	}
};

export const usersController = {
	createUserHandler,
};

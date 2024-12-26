import { NextFunction, Request, Response } from "express";
import { usersService } from "../services/users.service";
import {
	PatchUserBodyData,
	SignupUserBodyData,
} from "../validators/user.validators";

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

const patchUserHandler = async (
	req: Request<{}, {}, PatchUserBodyData>,
	res: Response,
	next: NextFunction
) => {
	try {
		const user = req.body;
		const userId = req.user.id;

		await usersService.updateUser(userId, user);

		res.status(200).send({ message: "User updated successfully" });
	} catch (e) {
		next(e);
	}
};

export const userController = {
	createUserHandler,
	patchUserHandler,
};

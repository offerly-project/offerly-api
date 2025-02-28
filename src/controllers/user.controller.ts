import { NextFunction, Request, Response } from "express";
import { mailService } from "../services/mail.service";
import { usersService } from "../services/users.service";
import {
	PatchUserBodyData,
	SignupUserBodyData,
	UserContactBodyData,
} from "../validators/user.validators";

const createUserHandler = async (
	req: Request<{}, {}, SignupUserBodyData>,
	res: Response,
	next: NextFunction
) => {
	try {
		const user = req.body;

		mailService.sendWelcomeMail(user.email, user.full_name, user.language);
		res.status(201).send({ message: "User created successfully" });
	} catch (e) {
		next(e);
	}
};

const contactHandler = async (
	req: Request<{}, {}, UserContactBodyData>,
	res: Response,
	next: NextFunction
) => {
	try {
		const userId = req.user.id;
		await usersService.userContact(userId, req.body);
		res.status(201).send({ message: "Contact email sent successfully" });
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

const deleteUserHandler = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	try {
		const { user } = req;
		const id = user.id;
		await usersService.deleteUser(id);
		res.status(200).send({ message: "User deleted successfully" });
	} catch (e) {
		next(e);
	}
};

export const userController = {
	createUserHandler,
	patchUserHandler,
	deleteUserHandler,
	contactHandler,
};

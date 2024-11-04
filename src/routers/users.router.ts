import { Router } from "express";
import { usersController } from "../controllers/users.controller";
import { validateRequest } from "../utils/utils";
import { signupUserSchema } from "../validators/users.validators";

export const usersRouter = Router();

usersRouter.post(
	"/",
	validateRequest(signupUserSchema),
	usersController.createUserHandler
);

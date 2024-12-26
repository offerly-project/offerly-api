import { Router } from "express";
import { omit } from "lodash";
import { userController } from "../controllers/user.controller";
import { authorizeUser } from "../middlewares/auth.middleware";
import { adminsRepository } from "../repositories/admins.repository";
import { usersRepository } from "../repositories/users.repository";
import { validateRequest } from "../utils/utils";
import { patchUserSchema } from "../validators/user.validators";

export const userAdminRouter = Router();

userAdminRouter.get("/", async (req, res) => {
	const userId = req.user.id;
	const data = await adminsRepository.findById(userId);
	res.send(omit(data, ["password", "_id"]));
});

export const userUserRouter = Router();

userUserRouter.get("/", async (req, res) => {
	const userId = req.user.id;
	const data = await usersRepository.findById(userId);
	res.send(omit(data, ["password", "_id"]));
});

userUserRouter.patch(
	"/",
	authorizeUser,
	validateRequest(patchUserSchema),
	userController.patchUserHandler
);

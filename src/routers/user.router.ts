import { Router } from "express";
import { omit } from "lodash";
import { adminsRepository } from "../repositories/admins.repository";
import { usersRepository } from "../repositories/users.repository";

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

import { Router } from "express";
import {
	banksAdminController,
	banksUserController,
} from "../controllers/banks.controller";
import { validateRequest } from "../utils/utils";
import {
	createBankSchema,
	updateBankSchema,
} from "../validators/bank.validators";

export const banksAdminRouter = Router();

banksAdminRouter.get("/", banksAdminController.getBanksHandler);

banksAdminRouter.get("/:id", banksAdminController.getBankHandler);

banksAdminRouter.post(
	"/",
	validateRequest(createBankSchema),
	banksAdminController.createBankHandler
);

banksAdminRouter.patch(
	"/:id",
	validateRequest(updateBankSchema),
	banksAdminController.updateBankHandler
);

export const banksUserRouter = Router();

banksUserRouter.get("/", banksUserController.getUserBanksHandler);

banksUserRouter.get("/:id/cards", banksUserController.getUserBankCardHandler);

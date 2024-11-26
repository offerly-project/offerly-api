import { Router } from "express";
import {
	banksAdminController,
	banksUserController,
} from "../controllers/banks.controller";
import { authorizeUser } from "../middlewares/auth.middleware";
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

banksUserRouter.get(
	"/",
	authorizeUser,
	banksUserController.getUserBanksHandler
);

banksUserRouter.get(
	"/:id/cards",
	authorizeUser,
	banksUserController.getUserBankCardsHandler
);

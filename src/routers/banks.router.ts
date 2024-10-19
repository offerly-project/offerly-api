import { Router } from "express";
import { banksController } from "../controllers/banks.controller";
import { validateRequest } from "../utils/utils";
import {
	createBankSchema,
	updateBankSchema,
} from "../validators/bank.validators";

export const banksRouter = Router();

banksRouter.get("/", banksController.getBanksHandler);

banksRouter.get("/:id", banksController.getBankHandler);

banksRouter.post(
	"/",
	validateRequest(createBankSchema),
	banksController.createBankHandler
);

banksRouter.patch(
	"/:id",
	validateRequest(updateBankSchema),
	banksController.updateBankHandler
);

import { Router } from "express";
import { cardsAdminController } from "../controllers/cards.controller";
import { validateRequest } from "../utils/utils";
import {
	createCardSchema,
	updateCardSchema,
} from "../validators/card.validators";

export const cardsAdminRouter = Router();

cardsAdminRouter.get("/", cardsAdminController.getCardsHandler);
cardsAdminRouter.get("/:id", cardsAdminController.getCardHandler);

cardsAdminRouter.post(
	"/",
	validateRequest(createCardSchema),
	cardsAdminController.createCardHandler
);

cardsAdminRouter.patch(
	"/:id",
	validateRequest(updateCardSchema),
	cardsAdminController.updateCardHandler
);

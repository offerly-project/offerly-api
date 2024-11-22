import { Router } from "express";
import { cardsController } from "../controllers/cards.controller";
import { validateRequest } from "../utils/utils";
import {
	createCardSchema,
	updateCardSchema,
} from "../validators/card.validators";

export const cardsAdminRouter = Router();

cardsAdminRouter.get("/", cardsController.getCardsHandler);
cardsAdminRouter.get("/:id", cardsController.getCardHandler);

cardsAdminRouter.post(
	"/",
	validateRequest(createCardSchema),
	cardsController.createCardHandler
);

cardsAdminRouter.patch(
	"/:id",
	validateRequest(updateCardSchema),
	cardsController.updateCardHandler
);

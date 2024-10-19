import { Router } from "express";
import { cardsController } from "../controllers/cards.controller";
import { validateRequest } from "../utils/utils";
import {
	createCardSchema,
	updateCardSchema,
} from "../validators/card.validators";

export const cardsRouter = Router();

cardsRouter.get("/", cardsController.getCardsHandler);
cardsRouter.get("/:id", cardsController.getCardHandler);

cardsRouter.post(
	"/",
	validateRequest(createCardSchema),
	cardsController.createCardHandler
);

cardsRouter.patch(
	"/:id",
	validateRequest(updateCardSchema),
	cardsController.updateCardHandler
);

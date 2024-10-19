import { Router } from "express";
import { cardsController } from "../controllers/cards.controller";
import { validateRequest } from "../utils/utils";
import { createCardSchema } from "../validators/card.validators";

export const cardsRouter = Router();

cardsRouter.get("/", cardsController.getCardsHandler);

cardsRouter.post(
	"/",
	validateRequest(createCardSchema),
	cardsController.createCardHandler
);

import { Router } from "express";
import {
	cardsAdminController,
	cardsUserController,
} from "../controllers/cards.controller";
import { authorizeUser } from "../middlewares/auth.middleware";
import { validateRequest } from "../utils/utils";
import {
	createCardSchema,
	updateCardSchema,
	updateUserCardsSchema,
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

export const cardsUserRouter = Router();

cardsUserRouter.get(
	"/",
	authorizeUser,
	cardsUserController.getUserCardsHandler
);

cardsUserRouter.put(
	"/",
	authorizeUser,
	validateRequest(updateUserCardsSchema),
	cardsUserController.putUserCardsHandler
);

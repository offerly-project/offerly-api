import { Router } from "express";
import { offersController } from "../controllers/offers.controller";
import { authorizeUser } from "../middlewares/auth.middleware";
import { validateRequest } from "../utils/utils";
import {
	createOfferSchema,
	getUserOffersSchema,
} from "../validators/offer.validators";

export const offersAdminRouter = Router();

offersAdminRouter.post(
	"/",
	validateRequest(createOfferSchema),
	offersController.createOfferHandler
);

offersAdminRouter.get("/", offersController.getOffersHandler);
offersAdminRouter.get("/:id", offersController.getOfferHandler);
offersAdminRouter.patch("/:id", offersController.updateOfferHandler);
offersAdminRouter.delete("/:id", offersController.deleteOfferHandler);

export const offersUserRouter = Router();

offersUserRouter.get(
	"/",
	authorizeUser,
	validateRequest(getUserOffersSchema),
	offersController.getUserOffersHandler
);

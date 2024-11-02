import { Router } from "express";
import { offersController } from "../controllers/offers.controller";
import { validateRequest } from "../utils/utils";
import { createOfferSchema } from "../validators/offer.validators";

export const offersRouter = Router();

offersRouter.post(
	"/",
	validateRequest(createOfferSchema),
	offersController.createOfferHandler
);

offersRouter.get("/", offersController.getOffersHandler);
offersRouter.get("/:id", offersController.getOfferHandler);
offersRouter.patch("/:id", offersController.updateOfferHandler);
offersRouter.delete("/:id", offersController.deleteOfferHandler);

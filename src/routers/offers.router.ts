import { Router } from "express";
import { offersController } from "../controllers/offers.controller";
import { validateRequest } from "../utils/utils";
import { createOfferSchema } from "../validators/offer.validators";

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

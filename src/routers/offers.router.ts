import { Router } from "express";
import { offersController } from "../controllers/offers.controller";
import {
	authorizeUser,
	customAuthorization,
} from "../middlewares/auth.middleware";
import { validateRequest } from "../utils/utils";
import {
	createOfferSchema,
	getUserOffersSchema,
	updateOfferSchema,
} from "../validators/offer.validators";

export const offersAdminRouter = Router();

offersAdminRouter.post(
	"/",
	validateRequest(createOfferSchema),
	offersController.createOfferHandler
);

offersAdminRouter.get("/", offersController.getOffersHandler);
offersAdminRouter.get("/:id", offersController.getOfferHandler);
offersAdminRouter.patch(
	"/:id",
	validateRequest(updateOfferSchema),
	offersController.updateOfferHandler
);
offersAdminRouter.delete("/:id", offersController.deleteOfferHandler);

export const offersUserRouter = Router();

offersUserRouter.get(
	"/",
	authorizeUser,
	validateRequest(getUserOffersSchema),
	offersController.getUserOffersHandler
);

offersUserRouter.get(
	"/last-chance",
	customAuthorization(["guest", "user"]),
	offersController.getUserLastChanceOffersHandler
);

offersUserRouter.get(
	"/newly-added",
	customAuthorization(["guest", "user"]),
	offersController.getUserNewlyAddedOfferHandler
);

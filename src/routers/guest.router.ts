import { Router } from "express";
import { guestController } from "../controllers/guest.controller";
import { authorizeGuest } from "../middlewares/auth.middleware";
import { validateRequest } from "../utils/utils";
import { guestContactSchema } from "../validators/user.validators";

export const guestRouter = Router();

guestRouter.get("/token", guestController.getGuestTokenHandler);

guestRouter.get(
	"/offers",
	authorizeGuest,
	guestController.getGuestOffersHandler
);

guestRouter.post(
	"/contact",
	authorizeGuest,
	validateRequest(guestContactSchema),
	guestController.contactGuestHandler
);

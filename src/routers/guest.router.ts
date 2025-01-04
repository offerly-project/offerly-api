import { Router } from "express";
import { guestController } from "../controllers/guest.controller";
import { authorizeGuest } from "../middlewares/auth.middleware";

export const guestRouter = Router();

guestRouter.get("/token", guestController.getGuestTokenHandler);

guestRouter.get(
	"/offers",
	authorizeGuest,
	guestController.getGuestOffersHandler
);

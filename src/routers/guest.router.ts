import { Router } from "express";
import { guestController } from "../controllers/guest.controller";

export const guestRouter = Router();

guestRouter.get("/token", guestController.getGuestTokenHandler);

guestRouter.get("/offers", guestController.getGuestOffersHandler);

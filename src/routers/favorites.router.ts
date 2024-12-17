import { Router } from "express";
import { favoritesController } from "../controllers/favorites.controller";
import { authorizeUser } from "../middlewares/auth.middleware";
import { validateRequest } from "../utils/utils";
import {
	deleteUserFavoriteOffersSchema,
	patchUserFavoriteOffersSchema,
} from "../validators/favorites.validators";

export const userFavoriteOffersRouter = Router();

userFavoriteOffersRouter.get(
	"/",
	authorizeUser,
	favoritesController.getUserFavoriteOffersHandler
);

userFavoriteOffersRouter.patch(
	"/",
	authorizeUser,
	validateRequest(patchUserFavoriteOffersSchema),
	favoritesController.patchUserFavoriteOffersHandler
);

userFavoriteOffersRouter.delete(
	"/",
	authorizeUser,
	validateRequest(deleteUserFavoriteOffersSchema),
	favoritesController.deleteUserFavoriteOffersHandler
);

import { NextFunction, Request, Response } from "express";
import { IOffer } from "../models/offer.model";
import { usersRepository } from "../repositories/users.repository";
import { transformDocsResponse } from "../utils/utils";
import {
	DeleteUserFavoriteOffersInput,
	PatchUserFavoriteOffersInput,
} from "../validators/favorites.validators";

const getUserFavoriteOffersHandler = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	try {
		const userId = req.user.id;
		const favorites = await usersRepository.getFavoriteOffers(userId);
		const elements: IOffer[] = favorites[0].favorites;
		res.status(200).send(transformDocsResponse(elements));
	} catch (e) {
		next(e);
	}
};

const patchUserFavoriteOffersHandler = async (
	req: Request<{}, {}, PatchUserFavoriteOffersInput>,
	res: Response,
	next: NextFunction
) => {
	try {
		const userId = req.user.id;
		const offers = req.body.offers;
		await usersRepository.patchFavoriteOffers(userId, offers);
		res.status(200).send({
			message: "favorite offers patched",
		});
	} catch (e) {
		next(e);
	}
};

const deleteUserFavoriteOffersHandler = async (
	req: Request<{}, {}, {}, DeleteUserFavoriteOffersInput>,
	res: Response,
	next: NextFunction
) => {
	try {
		const userId = req.user.id;
		const offers = req.query.offers.split(",");
		await usersRepository.removeFavoriteOffers(userId, offers);
		res.status(200).send({
			message: "favorite offers removed",
		});
	} catch (e) {
		next(e);
	}
};

export const favoritesController = {
	getUserFavoriteOffersHandler,
	patchUserFavoriteOffersHandler,
	deleteUserFavoriteOffersHandler,
};

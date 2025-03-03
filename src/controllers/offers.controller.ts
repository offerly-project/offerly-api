import { NextFunction, Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { offersService } from "../services/offers.service";
import { transformDocsResponse } from "../utils/utils";
import {
	CreateOfferBodyData,
	OffersQuery,
	UpdateOfferBodyData,
} from "../validators/offer.validators";

const createOfferHandler = async (
	req: Request<{}, {}, CreateOfferBodyData>,
	res: Response,
	next: NextFunction
) => {
	try {
		const id = await offersService.createOffer(req.body);

		res.status(StatusCodes.OK).send({ id });
	} catch (e) {
		next(e);
	}
};

const getOffersHandler = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	try {
		const offers = await offersService.getOffers();
		res.status(StatusCodes.OK).send(transformDocsResponse(offers));
	} catch (e) {
		next(e);
	}
};

const getOfferHandler = async (
	req: Request<{ id: string }>,
	res: Response,
	next: NextFunction
) => {
	try {
		const offer = await offersService.getOffer(req.params.id);
		res.status(StatusCodes.OK).send(transformDocsResponse(offer));
	} catch (e) {
		next(e);
	}
};

const updateOfferHandler = async (
	req: Request<{ id: string }, {}, UpdateOfferBodyData>,
	res: Response,
	next: NextFunction
) => {
	try {
		await offersService.updateOffer(req.params.id, req.body);
		res.status(StatusCodes.OK).send({ message: "Offer details updated" });
	} catch (e) {
		next(e);
	}
};

const deleteOfferHandler = async (
	req: Request<{ id: string }>,
	res: Response,
	next: NextFunction
) => {
	try {
		await offersService.deleteOffer(req.params.id);
		res.status(StatusCodes.OK).send({ message: "Offer deleted" });
	} catch (e) {
		next(e);
	}
};

const getUserOffersHandler = async (
	req: Request<{}, {}, {}, OffersQuery>,
	res: Response,
	next: NextFunction
) => {
	try {
		const userId = req.user.id;

		const offers = await offersService.getUserOffers(req.query, userId);
		res.status(StatusCodes.OK).send(transformDocsResponse(offers));
	} catch (e) {
		next(e);
	}
};

type TrendingOffersQuery = {
	limit?: number;
};

const getUserTrendingOffersHandler = async (
	req: Request<{}, {}, {}, TrendingOffersQuery>,
	res: Response,
	next: NextFunction
) => {
	try {
		const limit = req.query.limit || 10;
		const offers = await offersService.getTrendingOffers(+limit);
		res.status(StatusCodes.OK).send(transformDocsResponse(offers));
	} catch (e) {
		next(e);
	}
};

const getUserNewlyAddedOfferHandler = async (
	req: Request<{}, {}, {}, TrendingOffersQuery>,
	res: Response,
	next: NextFunction
) => {
	try {
		const limit = req.query.limit || 10;
		const offers = await offersService.getNewlyAddedOffers(+limit);
		res.status(StatusCodes.OK).send(transformDocsResponse(offers));
	} catch (e) {
		next(e);
	}
};

export const offersController = {
	createOfferHandler,
	getOffersHandler,
	getOfferHandler,
	updateOfferHandler,
	deleteOfferHandler,
	getUserOffersHandler,
	getUserTrendingOffersHandler,
	getUserNewlyAddedOfferHandler,
};

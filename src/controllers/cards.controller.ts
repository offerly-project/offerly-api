import { NextFunction, Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { cardsService } from "../services/cards.service";
import { CreateCardBodyData } from "../validators/card.validators";

const getCardsHandler = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	try {
		const cards = await cardsService.getAllCards();

		res.status(StatusCodes.OK).json(cards);
	} catch (error) {
		next(error);
	}
};

const createCardHandler = async (
	req: Request<{}, {}, CreateCardBodyData>,
	res: Response,
	next: NextFunction
) => {
	try {
		const cardId = await cardsService.createCard(req.body);

		res.status(StatusCodes.CREATED).json({ id: cardId });
	} catch (e) {
		next(e);
	}
};

export const cardsController = { getCardsHandler, createCardHandler };

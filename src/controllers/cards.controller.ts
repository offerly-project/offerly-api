import { NextFunction, Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { cardsService } from "../services/cards.service";
import {
	CreateCardBodyData,
	UpdateCardBodyData,
} from "../validators/card.validators";

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

const getCardHandler = async (
	req: Request<{ id: string }>,
	res: Response,
	next: NextFunction
) => {
	try {
		const cards = await cardsService.getCardById(req.params.id);

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

const updateCardHandler = async (
	req: Request<{ id: string }, {}, UpdateCardBodyData>,
	res: Response,
	next: NextFunction
) => {
	try {
		const { id } = req.params;
		const cardData = req.body;

		await cardsService.updateCard(id, cardData);

		res.status(StatusCodes.OK).json({ message: "Card details updated" });
	} catch (e) {
		next(e);
	}
};

export const cardsController = {
	getCardsHandler,
	createCardHandler,
	getCardHandler,
	updateCardHandler,
};

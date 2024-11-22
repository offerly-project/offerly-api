import { NextFunction, Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { cardsService } from "../services/cards.service";
import { usersService } from "../services/users.service";
import { transformDocsResponse } from "../utils/utils";
import {
	CreateCardBodyData,
	UpdateCardBodyData,
	UpdateUserCardsBodyData,
} from "../validators/card.validators";

const getCardsHandler = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	try {
		const cards = await cardsService.getAllCards();

		res.status(StatusCodes.OK).send(transformDocsResponse(cards));
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

		res.status(StatusCodes.OK).send(transformDocsResponse(cards));
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

		res.status(StatusCodes.OK).send({ id: cardId });
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

		res.status(StatusCodes.OK).send({ message: "Card details updated" });
	} catch (e) {
		next(e);
	}
};

export const cardsAdminController = {
	getCardsHandler,
	createCardHandler,
	getCardHandler,
	updateCardHandler,
};

const getUserCardsHandler = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	try {
		const userId = req.user.id;
		const cards = await cardsService.getUserCards(userId);

		res.status(StatusCodes.OK).send(transformDocsResponse(cards));
	} catch (e) {
		next(e);
	}
};

const putUserCardsHandler = async (
	req: Request<{}, {}, UpdateUserCardsBodyData>,
	res: Response,
	next: NextFunction
) => {
	try {
		const userId = req.user.id;
		const { cards } = req.body;
		await usersService.updateUserCards(userId, cards);

		res.status(StatusCodes.OK).send({
			message: "User cards updated",
		});
	} catch (e) {
		next(e);
	}
};

export const cardsUserController = { getUserCardsHandler, putUserCardsHandler };

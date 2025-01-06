import { NextFunction, Request, Response } from "express";
import { offersRepository } from "../repositories/offers.repository";
import { usersService } from "../services/users.service";
import { generateToken, transformDocsResponse } from "../utils/utils";

const getGuestTokenHandler = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	try {
		const token = await generateToken("_", "guest", "login", {
			expiresIn: "24h",
		});
		res.json({ token });
	} catch (e) {
		next(e);
	}
};

const getGuestOffersHandler = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	try {
		const offers = await offersRepository.getOffersByQuery({
			page: "1",
			limit: "10",
		});
		res.send(transformDocsResponse(offers.data));
	} catch (e) {
		next(e);
	}
};

const contactGuestHandler = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	try {
		const userId = req.user.id;
		await usersService.guestContact(req.body);
		res.status(201).send({ message: "Contact email sent successfully" });
	} catch (e) {
		next(e);
	}
};

export const guestController = {
	getGuestOffersHandler,
	getGuestTokenHandler,
	contactGuestHandler,
};

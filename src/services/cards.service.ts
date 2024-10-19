import { ObjectId } from "mongodb";
import { NotFoundError } from "../errors/errors";
import { ICard } from "../models/card.model";
import { banksRepository } from "../repositories/banks.repository";
import { cardsRepository } from "../repositories/cards.repository";
import { CreateCardBodyData } from "../validators/card.validators";

export class CardsService {
	async getAllCards() {
		const cards = await cardsRepository.getAll();

		return cards;
	}

	async createCard(card: CreateCardBodyData) {
		const bankExists = await banksRepository.findById(card.bank);
		if (!bankExists) {
			throw new NotFoundError("Bank with this name does not exist");
		}
		const newCard: ICard = {
			name: card.name,
			bank: new ObjectId(card.bank),
			logo: card.logo,
			grade: card.grade,
			scheme: card.scheme,
			status: "enabled",
			offers: [],
		};
		const cardId = await cardsRepository.create(newCard);

		return cardId;
	}
}

export const cardsService = new CardsService();

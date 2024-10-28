import { ObjectId } from "mongodb";
import { NotFoundError } from "../errors/errors";
import { ICard } from "../models/card.model";
import { banksRepository } from "../repositories/banks.repository";
import { cardsRepository } from "../repositories/cards.repository";
import { removeUndefinedValuesFromObject } from "../utils/utils";
import {
	CreateCardBodyData,
	UpdateCardBodyData,
} from "../validators/card.validators";

export class CardsService {
	async getAllCards() {
		const cards = await cardsRepository.getAll();

		return cards;
	}

	async getCardById(id: string) {
		const card = await cardsRepository.findById(id);

		if (!card) {
			throw new NotFoundError("Card with this id does not exist");
		}

		return card;
	}

	async createCard(card: CreateCardBodyData) {
		const bankExists = await banksRepository.findById(card.bank);
		if (!bankExists) {
			throw new NotFoundError("Bank with this name does not exist");
		}
		const cardDoc = await cardsRepository.findByName(card.name);
		if (cardDoc) {
			throw new NotFoundError("Card with this name already exists");
		}

		const newCard: ICard = removeUndefinedValuesFromObject({
			name: card.name,
			bank: new ObjectId(card.bank),
			logo: card.logo,
			grade: card.grade,
			scheme: card.scheme,
			status: "enabled",
			offers: [],
		});
		const cardId = await cardsRepository.create(newCard);

		return cardId;
	}

	async updateCard(id: string, card: UpdateCardBodyData) {
		const cardDoc = await cardsRepository.findById(id);
		if (!cardDoc) {
			throw new NotFoundError("Card not found");
		}

		if (card.name) {
			const foundCard = await cardsRepository.findByName(card.name);
			if (foundCard && foundCard._id.toString() !== id) {
				throw new NotFoundError("Card name already exists");
			}
		}

		const patchData: Partial<ICard> = removeUndefinedValuesFromObject({
			name: card.name,
			bank: card.bank ? new ObjectId(card.bank) : undefined,
			logo: card.logo,
			grade: card.grade,
			scheme: card.scheme,
			status: card.status,
			offers: card.offers?.map((offer) => new ObjectId(offer)),
		});

		await cardsRepository.update(id, patchData);
	}
}

export const cardsService = new CardsService();

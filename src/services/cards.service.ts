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
		console.log(card);

		if (!card) {
			throw new NotFoundError("Card with this id does not exist");
		}

		return card;
	}

	async createCard(card: CreateCardBodyData) {
		const bankExists = await banksRepository.bankNameExists(card.bank);
		if (!bankExists) {
			throw new NotFoundError("Bank with this name does not exist");
		}
		const cardNameTaken = await cardsRepository.cardNameExists(
			card.name,
			card.bank
		);
		if (cardNameTaken) {
			throw new NotFoundError("Card with this name already exists");
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

	async updateCard(id: string, card: UpdateCardBodyData) {
		const cardExists = await cardsRepository.findById(id);
		if (!cardExists) {
			throw new NotFoundError("Card not found");
		}

		const patchData: Partial<ICard> = removeUndefinedValuesFromObject({
			name: card.name,
			bank: new ObjectId(card.bank),
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

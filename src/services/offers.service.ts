import { ObjectId } from "mongodb";
import { NotFoundError } from "../errors/errors";
import { IOffer } from "../models/offer.model";
import { cardsRepository } from "../repositories/cards.repository";
import { offersRepository } from "../repositories/offers.repository";
import { usersRepository } from "../repositories/users.repository";
import { removeUndefinedValuesFromObject } from "../utils/utils";
import {
	CreateOfferBodyData,
	OffersQuery,
	UpdateOfferBodyData,
} from "../validators/offer.validators";

export class OffersService {
	async createOffer(data: CreateOfferBodyData) {
		const exists = await cardsRepository.cardsExists(data.applicable_cards);
		if (!exists) {
			throw new NotFoundError("some cards not found");
		}

		const offer: IOffer = removeUndefinedValuesFromObject({
			description: data.description,
			terms_and_conditions: data.terms_and_conditions,
			offer_source_link: data.offer_source_link,
			expiry_date: new Date(data.expiry_date),
			minimum_amount: data.minimum_amount,
			channels: data.channels,
			categories: data.categories,
			applicable_cards:
				data.applicable_cards?.map((id) => new ObjectId(id)) || [],
			logo: data.logo,
			discount_code: data.discount_code,
			starting_date: data.starting_date
				? new Date(data.starting_date)
				: undefined,
			cap: data.cap,
			status: "enabled",
			title: data.title,
			created_at: new Date(),
		});

		const id = await offersRepository.add(offer);

		await cardsRepository.addOfferToCards(id.toString(), data.applicable_cards);

		return id;
	}

	async getOffers() {
		const offers = await offersRepository.getAll();
		return offers;
	}

	async getOffer(id: string) {
		const offer = await offersRepository.findById(id);

		if (!offer) {
			throw new NotFoundError("Offer not found");
		}
		return offer;
	}

	async updateOffer(id: string, data: UpdateOfferBodyData) {
		const patchData: Partial<IOffer> = removeUndefinedValuesFromObject({
			description: data.description,
			terms_and_conditions: data.terms_and_conditions,
			offer_source_link: data.offer_source_link,
			expiry_date: data.expiry_date ? new Date(data.expiry_date) : undefined,
			minimum_amount: data.minimum_amount,
			channel: data.channels,
			categories: data.categories,
			applicable_cards: data.applicable_cards?.map((id) => new ObjectId(id)),
			logo: data.logo,
			discount_code: data.discount_code,
			starting_date: data.starting_date
				? new Date(data.starting_date)
				: undefined,
			cap: data.cap,
			status: data.status,
			title: data.title,
		});

		await offersRepository.update(id, patchData);
	}

	async deleteOffer(id: string) {
		const cards = await offersRepository.delete(id);
		await cardsRepository.removeOfferFromCards(id, cards);
	}

	async getUserOffers(query: OffersQuery, userId: string) {
		const user = await usersRepository.findById(userId);
		const userCards = user?.cards.map((card) => new ObjectId(card)) || [];
		const offers = await offersRepository.getOffersByQuery(query, userCards);
		return offers;
	}
}

export const offersService = new OffersService();

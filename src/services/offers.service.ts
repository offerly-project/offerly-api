import { ObjectId } from "mongodb";
import { NotFoundError } from "../errors/errors";
import { ErrorCodes } from "../errors/errors.codes";
import { IOffer } from "../models/offer.model";
import { cardsRepository } from "../repositories/cards.repository";
import { categoriesRepository } from "../repositories/categories.repository";
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

		const card = await cardsRepository.findById(data.applicable_cards[0]);
		if (!card) {
			throw new NotFoundError("Bank not found");
		}
		const bankId = card?.bank._id;
		const categoriesExist = categoriesRepository.categoriesExists(
			data.categories
		);

		if (!categoriesExist) {
			throw new NotFoundError(
				"categories not found",
				ErrorCodes.CATEGORY_NOT_FOUND
			);
		}

		const offer: IOffer = removeUndefinedValuesFromObject({
			description: data.description,
			terms_and_conditions: data.terms_and_conditions,
			offer_source_link: data.offer_source_link,
			expiry_date: new Date(data.expiry_date),
			minimum_amount: data.minimum_amount,
			channels: data.channels,
			categories: data.categories.map((id) => new ObjectId(id)) || [],
			applicable_cards:
				data.applicable_cards?.map((id) => new ObjectId(id)) || [],
			logo: data.logo,
			bankId: new ObjectId(bankId),
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
		let bankId: ObjectId | undefined;
		if (data.applicable_cards) {
			const card = await cardsRepository.findById(data.applicable_cards[0]);
			if (!card) {
				throw new NotFoundError("Bank not found");
			}
			bankId = card?.bank._id;
		}
		if (data.categories) {
			const categoriesExist = categoriesRepository.categoriesExists(
				data.categories
			);

			if (!categoriesExist) {
				throw new NotFoundError(
					"categories not found",
					ErrorCodes.CATEGORY_NOT_FOUND
				);
			}
		}

		const patchData: Partial<IOffer> = removeUndefinedValuesFromObject({
			description: data.description,
			terms_and_conditions: data.terms_and_conditions,
			offer_source_link: data.offer_source_link,
			expiry_date: data.expiry_date ? new Date(data.expiry_date) : undefined,
			minimum_amount: data.minimum_amount,
			channels: data.channels,
			categories: data.categories?.map((id) => new ObjectId(id)),
			applicable_cards: data.applicable_cards?.map((id) => new ObjectId(id)),
			logo: data.logo,
			discount_code: data.discount_code,
			bankId:
				data.applicable_cards?.length !== 0 ? new ObjectId(bankId) : undefined,
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

		if (query?.card === "*" && query.q === "") {
			return {
				metadata: {
					total: 0,
					limit: 0,
					offset: 0,
				},
				data: [],
			};
		}

		const offers = await offersRepository.getOffersByQuery(
			{
				...query,
				page: query.page || "1",
				limit: query.limit || "50",
			},
			userCards
		);
		return offers;
	}

	async getNewlyAddedOffers(limit: number) {
		const offers = await offersRepository.getRecentlyAddedOffers(limit);
		return offers;
	}

	async getTrendingOffers(limit: number) {
		const offers = await offersRepository.getTrendingOffers(limit);
		return offers;
	}
}

export const offersService = new OffersService();

import { ObjectId } from "mongodb";
import { NotFoundError } from "../errors/errors";
import { IOffer } from "../models/offer.model";
import { offersRepository } from "../repositories/offers.repository";
import { removeUndefinedValuesFromObject } from "../utils/utils";
import {
	CreateOfferBodyData,
	UpdateOfferBodyData,
} from "../validators/offer.validators";

export class OffersService {
	async createOffer(data: CreateOfferBodyData) {
		const offer: IOffer = removeUndefinedValuesFromObject({
			description: data.description,
			terms_and_conditions: data.terms_and_conditions,
			offer_source_link: data.offer_source_link,
			expiry_date: new Date(data.expiry_date),
			minimum_amount: data.minimum_amount,
			channel: data.channel,
			categories: data.categories,
			applicable_cards:
				data.applicable_cards?.map((id) => new ObjectId(id)) || [],
			logo: data.logo,
			discount_code: data.discount_code,
			starting_date: data.starting_date
				? new Date(data.starting_date)
				: undefined,
			cap: data.cap,
		});

		const id = await offersRepository.add(offer);

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
			channel: data.channel,
			categories: data.categories,
			applicable_cards: data.applicable_cards?.map((id) => new ObjectId(id)),
			logo: data.logo,
			discount_code: data.discount_code,
			starting_date: data.starting_date
				? new Date(data.starting_date)
				: undefined,
			cap: data.cap,
		});

		await offersRepository.update(id, patchData);
	}
}

export const offersService = new OffersService();

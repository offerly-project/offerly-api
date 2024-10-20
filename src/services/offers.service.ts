import { ObjectId } from "mongodb";
import { NotFoundError } from "../errors/errors";
import { IOffer } from "../models/offer.model";
import { offersRepository } from "../repositories/offers.repository";
import { storesRepository } from "../repositories/stores.repository";
import { removeUndefinedValuesFromObject } from "../utils/utils";
import {
	CreateOfferBodyData,
	UpdateOfferBodyData,
} from "../validators/offer.validators";

export class OffersService {
	async createOffer(data: CreateOfferBodyData) {
		const store = await storesRepository.findById(data.store.id);

		if (!store) {
			throw new NotFoundError("Store not found");
		}

		if (
			data.store.location &&
			store.locations &&
			!store.locations.includes(data.store.location)
		) {
			throw new NotFoundError("this store does not have this location");
		}

		const offer: IOffer = removeUndefinedValuesFromObject({
			description: data.description,
			terms_and_conditions: data.terms_and_conditions,
			offer_source_link: data.offer_source_link,
			expiry_date: new Date(data.expiry_date),
			minimum_amount: data.minimum_amount,
			channel: data.channel,
			store: {
				id: new ObjectId(data.store.id),
				location: data.store?.location,
			},
			categories: data.categories?.map((id) => new ObjectId(id)) || [],
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
		if (data.store) {
			const store = await storesRepository.findById(data.store.id);

			if (!store) {
				throw new NotFoundError("Store not found");
			}
			if (
				data.store.location &&
				store.locations &&
				!store.locations.includes(data.store.location)
			) {
				throw new NotFoundError("this store does not have this location");
			}
		}

		const patchData: Partial<IOffer> = removeUndefinedValuesFromObject({
			description: data.description,
			terms_and_conditions: data.terms_and_conditions,
			offer_source_link: data.offer_source_link,
			expiry_date: data.expiry_date ? new Date(data.expiry_date) : undefined,
			minimum_amount: data.minimum_amount,
			channel: data.channel,
			store: data.store
				? {
						id: data.store ? new ObjectId(data.store.id) : undefined,
						location: data.store?.location,
				  }
				: undefined,
			categories: data.categories?.map((id) => new ObjectId(id)),
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

import { Collection, ObjectId, WithId } from "mongodb";
import { db } from "../configs/db";
import { InternalServerError } from "../errors/errors";
import { IOffer } from "../models/offer.model";
import { OffersQuery } from "../validators/offer.validators";

export class OffersRepositry {
	private collection: Collection<IOffer>;

	constructor() {
		this.collection = db.getCollection("offers");
	}
	async add(data: IOffer) {
		const result = await this.collection.insertOne(data);
		if (!result.insertedId) {
			throw new InternalServerError("Failed to insert offer");
		}
		return result.insertedId;
	}

	async findById(id: string) {
		return this.collection
			.aggregate<WithId<IOffer>>([
				{
					$match: {
						_id: new ObjectId(id),
					},
				},
			])
			.toArray()
			.then((offers) => offers[0]);
	}

	async getAll() {
		return this.collection.aggregate<WithId<IOffer>>().toArray();
	}
	async update(id: string, data: Partial<IOffer>) {
		const result = await this.collection.updateOne(
			{ _id: new ObjectId(id) },
			{ $set: data }
		);
		if (!result.matchedCount) {
			throw new InternalServerError("Failed to update offer");
		}
	}

	async delete(id: string) {
		const offer = await this.collection.findOneAndDelete({
			_id: new ObjectId(id),
		});
		if (!offer) {
			throw new InternalServerError("Failed to delete offer");
		}

		const cards = offer.applicable_cards.map((card) => card.toString());

		return cards;
	}

	getOffersByQuery(query: OffersQuery) {
		const { card, category, page, limit, q } = query;
		const cardFilter = card
			? { applicable_cards: { $in: [new ObjectId(card)] } }
			: {};
		const categoryFilter = category ? { categories: { $in: [category] } } : {};
		const skip = (+page - 1) * +limit;

		const searchFilter = q
			? {
					$or: [
						{ "title.en": { $regex: q, $options: "i" } },
						{ "title.ar": { $regex: q, $options: "i" } },
						{ "terms_and_conditions.en": { $regex: q, $options: "i" } },
						{ "terms_and_conditions.ar": { $regex: q, $options: "i" } },
						{ "description.en": { $regex: q, $options: "i" } },
						{ "description.ar": { $regex: q, $options: "i" } },
					],
			  }
			: {};

		return this.collection
			.aggregate<WithId<IOffer>>([
				{
					$match: {
						...cardFilter,
						...categoryFilter,
						...searchFilter,
					},
				},
				{
					$facet: {
						metadata: [
							{ $count: "total" },
							{ $addFields: { page: +page, limit: +limit } },
						],
						data: [
							{ $skip: skip },
							{ $limit: +limit },
							{
								$project: {
									_id: 1,
									title: 1,
									description: 1,
									logo: 1,
									offer_source_link: 1,
									status: 1,
									terms_and_conditions: 1,
									expiry_date: 1,
									minimum_amount: 1,
									cap: 1,
									channels: 1,
									starting_date: 1,
									categories: 1,
								},
							},
						],
					},
				},
				{
					$unwind: "$metadata",
				},
			])
			.toArray()
			.then(
				(result) =>
					result[0] || {
						metadata: [{ total: 0, page: +page, limit: +limit }],
						data: [],
					}
			);
	}
}

export const offersRepository = new OffersRepositry();

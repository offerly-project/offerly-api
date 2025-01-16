import { Collection, Document, ObjectId, WithId } from "mongodb";
import { db } from "../configs/db";
import { InternalServerError } from "../errors/errors";
import { ErrorCodes } from "../errors/errors.codes";
import { IOffer } from "../models/offer.model";
import { getSortDirectionNumber } from "../utils/utils";
import { OffersQuery } from "../validators/offer.validators";

export class OffersRepositry {
	private collection: Collection<IOffer>;

	constructor() {
		this.collection = db.getCollection("offers");
	}
	async add(data: IOffer) {
		const result = await this.collection.insertOne(data);
		if (!result.insertedId) {
			throw new InternalServerError(
				"Failed to create offer",
				ErrorCodes.CREATE_OFFER_FAILED
			);
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
		if (!result.acknowledged) {
			throw new InternalServerError(
				"Failed to update offer",
				ErrorCodes.UPDATE_OFFER_FAILED
			);
		}
	}

	async delete(id: string) {
		const offer = await this.collection.findOneAndDelete({
			_id: new ObjectId(id),
		});
		if (!offer) {
			throw new InternalServerError(
				"Failed to delete offer",
				ErrorCodes.DELETE_OFFER_FAILED
			);
		}

		const cards = offer.applicable_cards.map((card) => card.toString());

		return cards;
	}
	async getOffersByQuery(
		query: OffersQuery,
		userCards: ObjectId[] = [],
		guest = false
	) {
		const { card, category, page, limit, q, sort_by, sort_direction } = query;
		const cards = card
			? card.split(",").map((cardId) => new ObjectId(cardId))
			: userCards;
		const cardFilter = { applicable_cards: { $in: cards } };

		const categoryFilter = category ? { categories: { $in: [category] } } : {};
		const skip = (+page - 1) * +limit;

		const searchFilter = q
			? {
					$or: [
						{ "title.en": { $regex: q, $options: "i" } },
						{ "title.ar": { $regex: q, $options: "i" } },
					],
			  }
			: {};

		const sortStage = !sort_by
			? {}
			: sort_by === "expiry_date"
			? {
					$sort: {
						expiry_date: getSortDirectionNumber(
							sort_direction ? sort_direction : "asc"
						),
					},
			  }
			: {
					$sort: {
						[`title.${sort_by.split("_")[1]}`]: getSortDirectionNumber(
							sort_direction ? sort_direction : "asc"
						),
					},
			  };

		const pipelineBase: Document[] = [
			{
				$match: {
					...(guest ? {} : cardFilter),
					...categoryFilter,
					...searchFilter,
					...{ status: { $eq: "enabled" } },
					...{ expiry_date: { $gte: new Date() } },
				},
			},
		];

		if (sort_by) {
			pipelineBase.push(sortStage);
		}

		return this.collection

			.aggregate<{
				data: WithId<IOffer>;
				metadata: {
					total: number;
					page: number;
					limit: number;
				};
			}>([
				...pipelineBase,
				{
					$facet: {
						metadata: [
							{ $count: "total" },
							{ $addFields: { page: +page, limit: +limit } },
						],
						data: [
							{
								$lookup: {
									from: "cards",
									localField: "applicable_cards",
									foreignField: "_id",
									as: "applicable_cards",
								},
							},

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
									applicable_cards: {
										_id: 1,
										name: 1,
										logo: 1,
									},
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

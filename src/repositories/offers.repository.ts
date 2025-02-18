import { Collection, Document, ObjectId, WithId } from "mongodb";
import { db } from "../configs/db";
import { InternalServerError } from "../errors/errors";
import { ErrorCodes } from "../errors/errors.codes";
import { IOffer } from "../models/offer.model";
import { getSortDirectionNumber } from "../utils/utils";
import { OffersQuery } from "../validators/offer.validators";
import { EventsEn, eventsRepository } from "./events.repository";

export class OffersRepositry {
	private collection: Collection<IOffer>;

	constructor() {
		this.collection = db.getCollection("offers");
	}
	async add(data: IOffer) {
		const result = await this.collection.insertOne(data);
		eventsRepository.pushEvent({
			type: EventsEn.NewOffer,
			offer: data.bankId.toString(),
			cards: data.applicable_cards.map((card) => card.toString()),
		});
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
				{
					$lookup: {
						from: "categories",
						localField: "categories",
						foreignField: "_id",
						as: "categories",
					},
				},
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
						applicable_cards: 1,
					},
				},
			])
			.toArray()
			.then((offers) => offers[0]);
	}

	async getAll() {
		return this.collection
			.aggregate<WithId<IOffer>>([
				{
					$lookup: {
						from: "banks",
						localField: "bankId",
						foreignField: "_id",
						as: "bank",
					},
				},
				{
					$unwind: "$bank",
				},
				{
					$lookup: {
						from: "categories",
						localField: "categories",
						foreignField: "_id",
						as: "categories",
					},
				},
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
						applicable_cards: 1,
					},
				},
				{
					$project: {
						"bank.cards": 0,
						bankId: 0,
					},
				},
			])
			.toArray();
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
		const { card, category, page, limit, q, sort_by, sort_direction, bank } =
			query;

		const cards =
			card && card !== "*"
				? card.split(",").map((cardId) => new ObjectId(cardId))
				: userCards;

		const cardFilter =
			card !== "*" && !bank ? { applicable_cards: { $in: cards } } : {};

		const bankFilter = bank ? { bankId: new ObjectId(bank) } : {};

		const categoryFilter = category
			? {
					$or: category.split(",").map((cat) => ({
						categories: { $regex: cat, $options: "i" },
					})),
			  }
			: {};

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
			: sort_by === "created_at"
			? {
					$sort: {
						created_at: getSortDirectionNumber(
							sort_direction ? sort_direction : "desc"
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
					...bankFilter,
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
							{
								$lookup: {
									from: "categories",
									localField: "categories",
									foreignField: "_id",
									as: "categories",
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
									categories: {
										$map: {
											input: "$categories",
											as: "category",
											in: "$$category.name",
										},
									},
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

	async getTrendingOffers(limit: number) {
		const result = await this.collection
			.aggregate<WithId<IOffer>>([
				{
					$match: {
						expiry_date: { $gte: new Date() },
						status: { $eq: "enabled" },
					},
				},
				{
					$sample: { size: limit },
				},
				{
					$lookup: {
						from: "cards",
						localField: "applicable_cards",
						foreignField: "_id",
						as: "applicable_cards",
					},
				},
				{
					$lookup: {
						from: "categories",
						localField: "categories",
						foreignField: "_id",
						as: "categories",
					},
				},
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
						categories: {
							$map: {
								input: "$categories",
								as: "category",
								in: "$$category.name",
							},
						},
						applicable_cards: {
							_id: 1,
							name: 1,
							logo: 1,
						},
					},
				},
			])
			.toArray();

		return result;
	}

	async getRecentlyAddedOffers(limit: number) {
		return this.collection
			.aggregate<WithId<IOffer>>([
				{
					$sort: {
						created_at: -1,
					},
				},
				{
					$match: {
						status: { $eq: "enabled" },
						expiry_date: { $gte: new Date() },
					},
				},
				{
					$lookup: {
						from: "cards",
						localField: "applicable_cards",
						foreignField: "_id",
						as: "applicable_cards",
					},
				},
				{
					$lookup: {
						from: "categories",
						localField: "categories",
						foreignField: "_id",
						as: "categories",
					},
				},
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
						categories: {
							$map: {
								input: "$categories",
								as: "category",
								in: "$$category.name",
							},
						},
						bankId: 1,
						applicable_cards: {
							_id: 1,
							name: 1,
							logo: 1,
						},
					},
				},
				{
					$group: {
						_id: "$bankId",
						offers: { $push: "$$ROOT" },
					},
				},
				{
					$project: {
						bankId: "$_id",
						offers: { $slice: ["$offers", 0, 2] },
						_id: 0,
					},
				},
				{
					$unwind: "$offers",
				},
				{
					$replaceRoot: { newRoot: "$offers" },
				},
				{
					$limit: limit,
				},
			])
			.toArray();
	}
}

export const offersRepository = new OffersRepositry();

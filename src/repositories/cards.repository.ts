import { Collection, Document, ObjectId, PullOperator, WithId } from "mongodb";
import { db } from "../configs/db";
import { InternalServerError } from "../errors/errors";
import { ICard } from "../models/card.model";
import { Translation } from "../ts/global";
import { languageSearchQuery } from "../utils/utils";

export class CardsRepository {
	private collection: Collection<ICard>;

	private _basePipeline: Document[] = [
		{
			$lookup: {
				from: "banks",
				localField: "bank",
				foreignField: "_id",
				as: "bank",
			},
		},
		{
			$unwind: "$bank",
		},
		{
			$lookup: {
				from: "offers",
				localField: "offers",
				foreignField: "_id",
				as: "offers",
			},
		},
	];

	private _userCardsPipeline: Document[] = [
		{
			$lookup: {
				from: "cards",
				localField: "cards",
				foreignField: "_id",
				as: "cards",
			},
		},
		{
			$lookup: {
				from: "banks",
				localField: "bank",
				foreignField: "_id",
				as: "bank",
			},
		},
		{
			$unwind: {
				path: "$bank",
				preserveNullAndEmptyArrays: true,
			},
		},
		{
			$project: {
				bank: {
					_id: 1,
					country: 1,
					type: 1,
					name: 1,
					logo: 1,
					status: 1,
				},
				offers: 0,
			},
		},
	];

	constructor() {
		this.collection = db.getCollection<ICard>("cards");
	}

	async findByName(name: Translation) {
		return await this.collection.findOne(languageSearchQuery("name", name));
	}

	async findById(id: string) {
		const card = await this.collection
			.aggregate<WithId<ICard>>([
				{
					$match: {
						_id: new ObjectId(id),
					},
				},
				...this._basePipeline,
			])
			.toArray()
			.then((cards) => cards[0]);

		if (!card) {
			return null;
		}
		return card;
	}

	async getAll() {
		return await this.collection
			.aggregate<WithId<ICard>>([...this._basePipeline])
			.toArray();
	}

	async create(card: ICard) {
		const result = await this.collection.insertOne(card);

		if (!result.insertedId) {
			throw new InternalServerError("Failed to create card");
		}

		return result.insertedId;
	}

	async findCards(ids: string[]) {
		return this.collection
			.aggregate([
				{
					$match: {
						_id: { $in: ids.map((id) => new ObjectId(id)) },
					},
				},
				...this._userCardsPipeline,
			])
			.toArray();
	}

	async update(id: string, card: Partial<ICard>) {
		const result = await this.collection.updateOne(
			{ _id: new ObjectId(id) },
			{ $set: card }
		);

		if (!result.matchedCount) {
			throw new InternalServerError("Failed to update card");
		}
	}

	addOfferToCards(offerId: string, cards: string[]) {
		return this.collection.updateMany(
			{ _id: { $in: cards.map((card) => new ObjectId(card)) } },
			{ $addToSet: { offers: new ObjectId(offerId) } }
		);
	}

	removeOfferFromCards(offerId: string, cards: string[]) {
		return this.collection.updateMany(
			{ _id: { $in: cards.map((card) => new ObjectId(card)) } },
			{
				$pull: { offers: new ObjectId(offerId) },
			} as unknown as PullOperator<ICard>
		);
	}
}

export const cardsRepository = new CardsRepository();

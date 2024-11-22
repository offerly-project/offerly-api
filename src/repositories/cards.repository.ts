import { Collection, Document, ObjectId, WithId } from "mongodb";
import { db } from "../configs/db";
import { InternalServerError } from "../errors/errors";
import { ICard } from "../models/card.model";

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

	constructor() {
		this.collection = db.getCollection<ICard>("cards");
	}

	async findByName(name: string) {
		return await this.collection.findOne({ name });
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
		return await this.collection
			.find({ _id: { $in: ids.map((id) => new ObjectId(id)) } })
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
			//@ts-ignore
			{ $pull: { offers: new ObjectId(offerId) } }
		);
	}
}

export const cardsRepository = new CardsRepository();

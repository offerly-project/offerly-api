import { Collection, ObjectId, WithId } from "mongodb";
import { db } from "../configs/db";
import { InternalServerError } from "../errors/errors";
import { IOffer } from "../models/offer.model";

export class OffersRepositry {
	private collection: Collection<IOffer>;

	private _offerCardsPipeline = [
		{
			$project: {
				applicable_cards: 1,
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
			$project: {
				_id: 0,
				applicable_cards: 1,
			},
		},
	];

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
}

export const offersRepository = new OffersRepositry();

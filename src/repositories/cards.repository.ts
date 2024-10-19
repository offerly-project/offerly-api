import { Collection, WithId } from "mongodb";
import { Database, db } from "../configs/db";
import { InternalServerError } from "../errors/errors";
import { ICard } from "../models/card.model";
import { documentToClient } from "../utils/utils";

export class CardsRepository {
	private collection: Collection<ICard>;
	constructor(db: Database) {
		this.collection = db.getCollection<ICard>("cards");
	}

	getAll() {
		return this.collection
			.aggregate<WithId<ICard>>([
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
			])
			.toArray()
			.then((cards) => cards.map(documentToClient));
	}

	async create(card: ICard) {
		const result = await this.collection.insertOne(card);

		if (!result.insertedId) {
			throw new InternalServerError("Failed to create card");
		}

		return result.insertedId;
	}
}

export const cardsRepository = new CardsRepository(db);

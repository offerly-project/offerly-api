import { Collection, ObjectId, WithId } from "mongodb";
import { db } from "../configs/db";
import { InternalServerError } from "../errors/errors";
import { IOffer } from "../models/offer.model";

export class OffersRepositry {
	private collection: Collection<IOffer>;

	private _basePipeline = [];
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
				...this._basePipeline,
			])
			.toArray()
			.then((offers) => offers[0]);
	}

	async getAll() {
		return this.collection
			.aggregate<WithId<IOffer>>(this._basePipeline)
			.toArray();
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
		const result = await this.collection.deleteOne({ _id: new ObjectId(id) });
		if (!result.deletedCount) {
			throw new InternalServerError("Failed to delete offer");
		}
	}
}

export const offersRepository = new OffersRepositry();

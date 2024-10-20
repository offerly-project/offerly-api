import { Collection, ObjectId, WithId } from "mongodb";
import { db } from "../configs/db";
import { InternalServerError } from "../errors/errors";
import { IOffer } from "../models/offer.model";

export class OffersRepositry {
	private collection: Collection<IOffer>;

	private _basePipeline = [
		{
			$lookup: {
				from: "stores",
				localField: "store.id",
				foreignField: "_id",
				as: "storeInstance",
			},
		},
		{
			$unwind: "$storeInstance",
		},
		{
			$project: {
				storeInstance: {
					offers: 0,
					locations: 0,
				},
			},
		},
		{
			$addFields: {
				"store.name": "$storeInstance.name",
				"store.logo": "$storeInstance.logo",
				"store.website_link": "$storeInstance.website_link",
			},
		},
		{
			$project: {
				storeInstance: 0,
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
		if (!result.modifiedCount) {
			throw new InternalServerError("Failed to update offer");
		}
	}
}

export const offersRepository = new OffersRepositry();

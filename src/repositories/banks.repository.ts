import { Collection, Document, ObjectId, WithId } from "mongodb";
import { db } from "../configs/db";
import { InternalServerError, NotFoundError } from "../errors/errors";
import { IBank } from "../models/bank.model";

export class BanksRepository {
	private collection: Collection<IBank>;

	private _basePipeline: Document[] = [
		{
			$lookup: {
				from: "cards",
				localField: "cards",
				foreignField: "_id",
				as: "cards",
			},
		},
	];

	constructor() {
		this.collection = db.getCollection<IBank>("banks");
	}

	async bankNameExists(name: string) {
		return (await this.collection.findOne({ name })) !== null;
	}

	async findById(id: string) {
		const bank = await this.collection
			.aggregate<WithId<IBank>>([
				{
					$match: {
						_id: new ObjectId(id),
					},
				},
				...this._basePipeline,
			])
			.toArray()
			.then((result) => result[0]);

		if (!bank) {
			throw new NotFoundError("Bank not found");
		}

		return bank;
	}

	async add(bank: IBank) {
		const result = await this.collection.insertOne(bank);

		if (!result.insertedId) {
			throw new InternalServerError("Failed to create bank");
		}

		return result.insertedId;
	}

	async update(id: string, bank: Partial<IBank>) {
		const result = await this.collection.updateOne(
			{ _id: new ObjectId(id) },
			{ $set: bank }
		);

		if (!result.matchedCount) {
			throw new InternalServerError("Failed to update bank");
		}
	}
	async getAll() {
		return await this.collection
			.aggregate<WithId<IBank>>([...this._basePipeline])
			.toArray();
	}
}

export const banksRepository = new BanksRepository();

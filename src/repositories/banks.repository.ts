import { Collection, ObjectId } from "mongodb";
import { Database, db } from "../configs/db";
import { InternalServerError } from "../errors/errors";
import { IBank } from "../models/bank.model";

export class BanksRepository {
	private collection: Collection<IBank>;
	constructor(db: Database) {
		this.collection = db.getCollection<IBank>("banks");
	}

	findByName(name: string) {
		return this.collection.findOne({ name });
	}

	findById(id: string) {
		return this.collection.findOne({ _id: new ObjectId(id) });
	}

	async create(bank: IBank) {
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

		return id;
	}
}

export const banksRepository = new BanksRepository(db);

import { Collection } from "mongodb";
import { Database, db } from "../configs/db";
import { IBank } from "../models/bank.model";

export class BanksRepository {
	private collection: Collection<IBank>;
	constructor(db: Database) {
		this.collection = db.getCollection<IBank>("banks");
	}
	async create(bank: IBank) {
		const result = await this.collection.insertOne(bank);

		if (!result.insertedId) {
			throw new Error("Failed to create bank");
		}

		return result.insertedId;
	}
}

export const banksRepository = new BanksRepository(db);

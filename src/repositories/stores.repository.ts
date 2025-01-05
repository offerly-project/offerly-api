import { Collection, ObjectId } from "mongodb";
import { db } from "../configs/db";
import { InternalServerError } from "../errors/errors";
import { ErrorCodes } from "../errors/errors.codes";
import { IStore } from "../models/store.model";

// NON-MVP CODE
export class StoresRepository {
	private collection: Collection<IStore>;

	constructor() {
		this.collection = db.getCollection<IStore>("stores");
	}

	async findById(id: string) {
		const store = await this.collection.findOne({ _id: new ObjectId(id) });
		return store ? store : null;
	}

	async getAll() {
		return await this.collection.find().toArray();
	}

	async storeNameExists(name: string) {
		return (await this.collection.findOne({ name })) !== null;
	}

	async findByName(name: string) {
		const store = await this.collection.findOne({ name });
		return store ? store : null;
	}

	async add(store: IStore) {
		const result = await this.collection.insertOne(store);
		if (!result.insertedId) {
			throw new InternalServerError("Failed to create store");
		}
		return result.insertedId;
	}

	async update(id: string, store: Partial<IStore>) {
		const result = await this.collection.updateOne(
			{ _id: new ObjectId(id) },
			{ $set: store }
		);
		if (!result.acknowledged) {
			throw new InternalServerError(
				"Failed to update store",
				ErrorCodes.UPDATE_STORE_FAILED
			);
		}
	}
}

export const storesRepository = new StoresRepository();

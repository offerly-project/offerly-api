import { Collection, ObjectId } from "mongodb";
import { db } from "../configs/db";
import { InternalServerError } from "../errors/errors";
import { ICategory } from "../models/category.model";

export class CategoriesRepository {
	private collection: Collection<ICategory>;
	constructor() {
		this.collection = db.getCollection("categories");
	}
	async create(data: ICategory) {
		const result = await this.collection.insertOne(data);

		if (!result.insertedId) {
			throw new InternalServerError("Failed to create category");
		}

		return result.insertedId;
	}

	async getAll() {
		return await this.collection.find().toArray();
	}

	async getById(id: string) {
		return await this.collection.findOne({ _id: new ObjectId(id) });
	}

	async categoryNameExists(name: string) {
		return (await this.collection.findOne({ name })) !== null;
	}

	async update(id: string, data: Partial<ICategory>) {
		const result = await this.collection.updateOne(
			{ _id: new ObjectId(id) },
			{ $set: data }
		);

		if (!result.matchedCount) {
			throw new InternalServerError("Failed to update category");
		}
	}
	async findById(id: string) {
		const category = await this.collection.findOne({ _id: new ObjectId(id) });

		if (!category) {
			return null;
		}
		return category;
	}

	async findByName(name: string) {
		const category = await this.collection.findOne({ name });

		if (!category) {
			return null;
		}
		return category;
	}
}

export const categoriesRepostiory = new CategoriesRepository();

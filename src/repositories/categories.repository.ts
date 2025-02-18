import { Collection } from "mongodb";
import { Database, db } from "../configs/db";
import { ICategory } from "../models/category.model";

export class CategoriesRepository {
	collection: Collection<ICategory>;

	constructor(db: Database) {
		this.collection = db.getCollection<ICategory>("categories");
	}

	async getCategories() {
		return this.collection.aggregate<ICategory>().toArray();
	}

	async categoriesExists(ids: string[]) {
		const categories = await this.collection
			.find({ _id: { $in: ids } })
			.toArray();
		return categories.length === ids.length;
	}
}

export const categoriesRepository = new CategoriesRepository(db);

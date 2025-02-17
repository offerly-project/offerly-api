import { Collection } from "mongodb";
import { Database, db } from "../configs/db";
import { ICategory } from "../models/category.model";

export class CategoriesRepository {
	collection: Collection<ICategory>;

	constructor(db: Database) {
		this.collection = db.getCollection<ICategory>("categories");
	}

	async getCategories() {
		return this.collection
			.aggregate([
				{
					$project: {
						_id: 0,
					},
				},
			])
			.toArray();
	}
}

export const categoriesRepository = new CategoriesRepository(db);

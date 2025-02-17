import { Collection } from "mongodb";
import { Database, db } from "../configs/db";
import { ILanguage } from "../models/language.model";

export class LanguagesRepository {
	collection: Collection<ILanguage>;

	constructor(db: Database) {
		this.collection = db.getCollection<ILanguage>("languages");
	}

	async getLanguages() {
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

export const languagesRepository = new LanguagesRepository(db);

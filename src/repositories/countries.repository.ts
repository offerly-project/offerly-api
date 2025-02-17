import { Collection } from "mongodb";
import { Database, db } from "../configs/db";
import { ICountry } from "../models/country.model";

export class CountriesRepository {
	collection: Collection<ICountry>;

	constructor(db: Database) {
		this.collection = db.getCollection<ICountry>("countries");
	}

	async getCountries() {
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

export const countriesRepository = new CountriesRepository(db);

import { Collection, ObjectId } from "mongodb";
import { Database, db } from "../configs/db";
import { ICountry } from "../models/country.model";

export class CountriesRepository {
	collection: Collection<ICountry>;

	constructor(db: Database) {
		this.collection = db.getCollection<ICountry>("countries");
	}

	async getCountries() {
		return this.collection.aggregate<ICountry>().toArray();
	}

	async countryExists(id: string) {
		return this.collection.findOne({ _id: { $eq: new ObjectId(id) } });
	}
}

export const countriesRepository = new CountriesRepository(db);

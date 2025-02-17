import { Document, MongoClient } from "mongodb";
import { env } from "./env";

type Collections =
	| "admins"
	| "banks"
	| "cards"
	| "offers"
	| "users"
	| "countries"
	| "categories"
	| "languages"
	| "stores"
	| "events"
	| "deleted-users"
	| "categories";

export class Database {
	private _client: MongoClient;
	constructor() {
		console.log(env.DB_URL);

		this._client = new MongoClient(env.DB_URL);
	}

	async connect() {
		try {
			await this._client.connect();
		} catch (e) {
			throw e;
		}
	}

	async disconnect() {
		this._client.close();
	}

	get db() {
		return this._client.db("offerly");
	}

	getCollection<T extends Document>(name: Collections) {
		return this.db.collection<T>(name);
	}
}

export const db = new Database();

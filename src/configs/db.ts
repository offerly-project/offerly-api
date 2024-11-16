import { Document, MongoClient } from "mongodb";
import { env } from "./env";

type Collections =
	| "admins"
	| "banks"
	| "cards"
	| "offers"
	| "users"
	| "stores"
	| "categories";

export class Database {
	private _client: MongoClient;
	constructor() {
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

import { Collection } from "mongodb";
import { Database, db } from "../configs/db";
import { IUser } from "../models/user.model";

export class UsersRepository {
	collection: Collection<IUser>;
	constructor(db: Database) {
		this.collection = db.getCollection("users");
	}

	async create(user: IUser) {
		return this.collection.insertOne(user);
	}

	async findByEmail(email: string) {
		return this.collection.findOne({ email });
	}
}

export const usersRepository = new UsersRepository(db);

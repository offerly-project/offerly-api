import { Collection, ObjectId } from "mongodb";
import { Database, db } from "../configs/db";
import { InternalServerError } from "../errors/errors";
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

	async findById(id: string) {
		return this.collection.findOne({ _id: new ObjectId(id) });
	}

	async updatePassword(id: string, password: string) {
		const result = await this.collection.updateOne(
			{ _id: new ObjectId(id) },
			{ $set: { password } }
		);
		if (result.modifiedCount === 0) {
			throw new InternalServerError("Password not updated");
		}
	}
	async updateCards(id: string, cards: string[]) {
		const result = await this.collection.updateOne(
			{ _id: new ObjectId(id) },
			{ $set: { cards: cards.map((card) => new ObjectId(card)) } }
		);
		if (result.modifiedCount === 0) {
			throw new InternalServerError("Cards not updated");
		}
	}
}

export const usersRepository = new UsersRepository(db);

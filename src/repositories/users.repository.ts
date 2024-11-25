import { Collection, ObjectId, PullOperator } from "mongodb";
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
	async updateCards(userId: string, cards: string[]) {
		const result = await this.collection.updateOne(
			{ _id: new ObjectId(userId) },
			{
				$addToSet: {
					cards: { $each: cards.map((card) => new ObjectId(card)) },
				},
			}
		);
		if (result.modifiedCount === 0) {
			throw new InternalServerError("Cards not updated");
		}
	}

	async removeCards(userId: string, cards: string[]) {
		const result = await this.collection.updateOne(
			{ _id: new ObjectId(userId) },
			{
				$pull: { cards: { $in: cards.map((card) => new ObjectId(card)) } },
			} as unknown as PullOperator<IUser>
		);
		if (result.modifiedCount === 0) {
			throw new InternalServerError("Cards not removed");
		}
	}
}

export const usersRepository = new UsersRepository(db);

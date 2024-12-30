import { Collection, ObjectId, PullOperator } from "mongodb";
import { Database, db } from "../configs/db";
import { InternalServerError } from "../errors/errors";
import { IUser } from "../models/user.model";

export class UsersRepository {
	collection: Collection<IUser>;

	private _favoritesPipeline = [
		{
			$lookup: {
				from: "offers",
				localField: "favorites",
				foreignField: "_id",
				as: "favorites",
			},
		},
		{
			$project: {
				favorites: {
					applicable_cards: 0,
				},
			},
		},
	];

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

	async findByPhone(phone_number: string) {
		return this.collection.findOne({ phone_number });
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
	async getFavoriteOffers(userId: string) {
		return this.collection
			.aggregate([
				{
					$match: {
						_id: new ObjectId(userId),
					},
				},
				...this._favoritesPipeline,
			])
			.toArray();
	}

	async patchFavoriteOffers(userId: string, offers: string[]) {
		const favoriteObjectIds = offers.map((offer) => new ObjectId(offer));

		await this.collection.updateOne(
			{ _id: new ObjectId(userId) },
			{
				$addToSet: {
					favorites: { $each: favoriteObjectIds },
				},
			}
		);
	}

	async removeFavoriteOffers(userId: string, offers: string[]) {
		await this.collection.updateOne({ _id: new ObjectId(userId) }, {
			$pull: {
				favorites: { $in: offers.map((offer) => new ObjectId(offer)) },
			},
		} as unknown as PullOperator<IUser>);
	}
	async update(userId: string, data: Partial<IUser>) {
		const result = await this.collection.updateOne(
			{ _id: new ObjectId(userId) },
			{ $set: data }
		);
		if (!result.matchedCount) {
			throw new InternalServerError("User not updated");
		}
	}
}

export const usersRepository = new UsersRepository(db);

import { Collection, ObjectId, PullOperator } from "mongodb";
import { Database, db } from "../configs/db";
import { InternalServerError } from "../errors/errors";
import { ErrorCodes } from "../errors/errors.codes";
import { IOffer } from "../models/offer.model";
import { IUser } from "../models/user.model";

export class UsersRepository {
	collection: Collection<IUser>;
	deletedUsersCollection: Collection<IUser>;

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
			$unwind: "$favorites", // Ensure each favorite is handled separately
		},
		{
			$replaceRoot: {
				newRoot: "$favorites", // Replace the root with the favorite object
			},
		},
		{
			$lookup: {
				from: "cards",
				localField: "applicable_cards",
				foreignField: "_id",
				as: "applicable_cards",
			},
		},
		{
			$lookup: {
				from: "categories",
				localField: "categories",
				foreignField: "_id",
				as: "categories",
			},
		},
		{
			$project: {
				_id: 1,
				title: 1,
				description: 1,
				logo: 1,
				offer_source_link: 1,
				status: 1,
				terms_and_conditions: 1,
				expiry_date: 1,
				minimum_amount: 1,
				cap: 1,
				channels: 1,
				bankId: 1,
				starting_date: 1,
				categories: 1,
				applicable_cards: 1,
			},
		},
	];

	constructor(db: Database) {
		this.collection = db.getCollection("users");
		this.deletedUsersCollection = db.getCollection("deleted-users");
	}

	async getUsersFavorites() {
		return this.collection
			.aggregate<
				Pick<
					IUser,
					| "expiry_date"
					| "notification_token"
					| "_id"
					| "logged_in"
					| "full_name"
				> & {
					favorites: IOffer[];
				}
			>([
				{
					$lookup: {
						from: "offers",
						localField: "favorites",
						foreignField: "_id",
						as: "favorites",
					},
				},
			])
			.toArray();
	}

	async findUsersWithCards(cards: string[]) {
		return this.collection
			.aggregate<
				Pick<
					IUser,
					"_id" | "notification_token" | "full_name" | "logged_in"
				> & {
					cards: {
						_id: ObjectId;
						name: {
							en: string;
							ar: string;
						};
					}[];
				}
			>([
				{
					$match: {
						cards: {
							$elemMatch: { $in: cards.map((card) => new ObjectId(card)) },
						},
					},
				},
				{
					$lookup: {
						from: "cards",
						localField: "cards",
						foreignField: "_id",
						as: "cards",
					},
				},
			])
			.toArray();
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
			throw new InternalServerError(
				"Password not updated",
				ErrorCodes.UPDATE_PASSWORD_FAILED
			);
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
			throw new InternalServerError(
				"Cards not updated",
				ErrorCodes.UPDATE_CARD_FAILED
			);
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
			throw new InternalServerError(
				"Cards not removed",
				ErrorCodes.UPDATE_CARD_FAILED
			);
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
	async removeInvalidNotificationTokens(userId: string, tokens: string[]) {
		await this.collection.updateOne(
			{ _id: new ObjectId(userId) },
			{
				//@ts-ignore
				$pull: {
					notification_token: { token: { $in: tokens } },
				},
			}
		);
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

	moveToHistory(user: IUser) {
		return this.deletedUsersCollection.insertOne(user);
	}

	async removeFavoriteOffers(userId: string, offers: string[]) {
		await this.collection.updateOne({ _id: new ObjectId(userId) }, {
			$pull: {
				favorites: { $in: offers.map((offer) => new ObjectId(offer)) },
			},
		} as unknown as PullOperator<IUser>);
	}

	async deleteUser(userId: string) {
		return await this.collection.deleteOne({ _id: new ObjectId(userId) });
	}

	async update(userId: string, data: Partial<IUser>) {
		const result = await this.collection.updateOne(
			{ _id: new ObjectId(userId) },
			{ $set: data }
		);
		if (!result.acknowledged) {
			throw new InternalServerError(
				"User not updated",
				ErrorCodes.UPDATE_USER_FAILED
			);
		}
	}
}

export const usersRepository = new UsersRepository(db);

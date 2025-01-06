import { Collection, Document, ObjectId, PullOperator, WithId } from "mongodb";
import { db } from "../configs/db";
import { InternalServerError } from "../errors/errors";
import { ErrorCodes } from "../errors/errors.codes";
import { ICard } from "../models/card.model";
import { Translation } from "../ts/global";
import { languageSearchQuery } from "../utils/utils";

export class CardsRepository {
	private collection: Collection<ICard>;

	private _basePipeline: Document[] = [
		{
			$lookup: {
				from: "banks",
				localField: "bank",
				foreignField: "_id",
				as: "bank",
			},
		},
		{
			$unwind: "$bank",
		},
		{
			$lookup: {
				from: "offers",
				localField: "offers",
				foreignField: "_id",
				as: "offers",
			},
		},
	];

	private _userCardsPipeline: Document[] = [
		{
			$match: {
				status: { $eq: "enabled" },
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
		{
			$project: {
				cards: 0,
				offers: 0,
			},
		},
		{
			$lookup: {
				from: "banks",
				localField: "bank",
				foreignField: "_id",
				as: "bank",
			},
		},
		{
			$unwind: "$bank",
		},
		{
			$project: {
				bank: {
					cards: 0,
				},
			},
		},
		{
			$match: {
				"bank.status": { $eq: "enabled" },
			},
		},
	];

	constructor() {
		this.collection = db.getCollection<ICard>("cards");
	}

	async findByName(name: Translation) {
		return await this.collection.findOne(languageSearchQuery("name", name));
	}

	async findById(id: string) {
		const card = await this.collection
			.aggregate<WithId<ICard>>([
				{
					$match: {
						_id: new ObjectId(id),
					},
				},
				...this._basePipeline,
			])
			.toArray()
			.then((cards) => cards[0]);

		if (!card) {
			return null;
		}
		return card;
	}

	async getAll() {
		return await this.collection
			.aggregate<WithId<ICard>>([...this._basePipeline])
			.toArray();
	}

	async create(card: ICard) {
		const result = await this.collection.insertOne(card);

		if (!result.insertedId) {
			throw new InternalServerError(
				"Failed to create card",
				ErrorCodes.CREATE_CARD_FAILED
			);
		}

		return result.insertedId;
	}

	async findCards(ids: string[]) {
		return this.collection
			.aggregate<WithId<ICard>>([
				{
					$match: {
						_id: { $in: ids.map((id) => new ObjectId(id)) },
					},
				},
				...this._userCardsPipeline,
			])
			.toArray();
	}

	async update(id: string, card: Partial<ICard>) {
		const result = await this.collection.updateOne(
			{ _id: new ObjectId(id) },
			{ $set: card }
		);

		if (!result.acknowledged) {
			throw new InternalServerError(
				"Failed to update card",
				ErrorCodes.UPDATE_CARD_FAILED
			);
		}
	}

	addOfferToCards(offerId: string, cards: string[]) {
		return this.collection.updateMany(
			{ _id: { $in: cards.map((card) => new ObjectId(card)) } },
			{ $addToSet: { offers: new ObjectId(offerId) } }
		);
	}

	removeOfferFromCards(offerId: string, cards: string[]) {
		return this.collection.updateMany(
			{ _id: { $in: cards.map((card) => new ObjectId(card)) } },
			{
				$pull: { offers: new ObjectId(offerId) },
			} as unknown as PullOperator<ICard>
		);
	}
}

export const cardsRepository = new CardsRepository();

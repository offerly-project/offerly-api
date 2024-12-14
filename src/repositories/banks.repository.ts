import { Collection, Document, ObjectId, WithId } from "mongodb";
import { db } from "../configs/db";
import { InternalServerError, NotFoundError } from "../errors/errors";
import { IBank } from "../models/bank.model";
import { Translation } from "../ts/global";
import { languageSearchQuery } from "../utils/utils";

export class BanksRepository {
	private collection: Collection<IBank>;

	private _basePipeline: Document[] = [
		{
			$lookup: {
				from: "cards",
				localField: "cards",
				foreignField: "_id",
				as: "cards",
			},
		},
	];

	private _bankCardsPipeline: Document[] = [
		{
			$lookup: {
				from: "cards",
				localField: "cards",
				foreignField: "_id",
				as: "cards",
			},
		},

		{
			$lookup: {
				from: "banks",
				localField: "_id",
				foreignField: "_id",
				as: "bank",
			},
		},

		{
			$unwind: "$bank",
		},
		{
			$project: {
				_id: 0,
				bank: {
					name: "$bank.name",
					logo: "$bank.logo",
					country: "$bank.country",
					type: "$bank.type",
					status: "$bank.status",
					_id: "$bank._id",
				},
				cards: 1,
			},
		},
		{
			$project: {
				cards: {
					bank: 0,
					offers: 0,
				},
			},
		},
	];
	private _userBanksPipeline: Document[] = [
		{
			$project: {
				name: 1,
				logo: 1,
				type: 1,
				country: 1,
				status: 1,
				_id: 1,
			},
		},
		{
			$project: {
				cards: 0,
			},
		},
	];

	constructor() {
		this.collection = db.getCollection<IBank>("banks");
	}

	async bankNameExists(name: Translation) {
		return (
			(await this.collection.findOne(languageSearchQuery("name", name))) !==
			null
		);
	}

	async findByName(name: Translation) {
		return await this.collection.findOne(languageSearchQuery("name", name));
	}

	async getBankCardsIds(id: string) {
		const bank = await this.collection.findOne({ _id: new ObjectId(id) });

		if (!bank) {
			throw new NotFoundError("Bank not found");
		}

		return bank.cards;
	}

	async findById(id: string) {
		const bank = await this.collection
			.aggregate<WithId<IBank>>([
				{
					$match: {
						_id: new ObjectId(id),
					},
				},
				...this._basePipeline,
			])
			.toArray()
			.then((result) => result[0]);

		if (!bank) {
			throw new NotFoundError("Bank not found");
		}

		return bank;
	}

	async add(bank: IBank) {
		const result = await this.collection.insertOne(bank);

		if (!result.insertedId) {
			throw new InternalServerError("Failed to create bank");
		}

		return result.insertedId;
	}

	async update(id: string, bank: Partial<IBank>) {
		const result = await this.collection.updateOne(
			{ _id: new ObjectId(id) },
			{ $set: bank }
		);

		if (!result.matchedCount) {
			throw new InternalServerError("Failed to update bank");
		}
	}

	async getUserBanks() {
		return this.collection
			.aggregate<IBank[]>(this._userBanksPipeline)
			.toArray();
	}

	async getAll() {
		return await this.collection
			.aggregate<WithId<IBank>>([...this._basePipeline])
			.toArray();
	}

	async getCardsByBankId(id: string) {
		const docs = await this.collection
			.aggregate([
				{
					$match: {
						_id: new ObjectId(id),
					},
				},
				...this._bankCardsPipeline,
			])
			.toArray();
		return docs[0];
	}
}

export const banksRepository = new BanksRepository();

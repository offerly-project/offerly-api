import { Collection } from "mongodb";
import { Database, db } from "../configs/db";
import { IAdmin } from "../models/admin.model";

export class AdminsRepository {
	private collection: Collection<IAdmin>;
	constructor(db: Database) {
		this.collection = db.getCollection<IAdmin>("admins");
	}

	async findOneByUsername(username: string) {
		const admin = await this.collection.findOne({
			username,
		});
		return admin;
	}
}

export const adminsRepository = new AdminsRepository(db);

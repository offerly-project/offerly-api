import { Collection } from "mongodb";
import { db } from "../configs/db";
import { IAdmin } from "../models/admin.model";

export class AdminsRepository {
	private collection: Collection<IAdmin>;
	constructor() {
		this.collection = db.getCollection<IAdmin>("admins");
	}

	async findByEmail(email: string) {
		const admin = await this.collection.findOne({
			email,
		});
		return admin;
	}

	async findOneByUsername(username: string) {
		const admin = await this.collection.findOne({
			username,
		});
		return admin;
	}
}

export const adminsRepository = new AdminsRepository();

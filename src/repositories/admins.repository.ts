import { Collection, ObjectId } from "mongodb";
import { db } from "../configs/db";
import { IAdmin } from "../models/admin.model";

export class AdminsRepository {
	private collection: Collection<IAdmin>;
	constructor() {
		this.collection = db.getCollection<IAdmin>("admins");
	}

	async findById(id: string) {
		const admin = await this.collection.findOne({
			_id: new ObjectId(id),
		});
		return admin;
	}

	async findByUsername(username: string) {
		const admin = await this.collection.findOne({
			username,
		});
		return admin;
	}
}

export const adminsRepository = new AdminsRepository();

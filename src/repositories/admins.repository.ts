import { Database, db } from "../configs/db";
import { AdminType } from "../models/users.models";

export class AdminsRepository {
	database: Database;
	constructor(db: Database) {
		this.database = db;
	}

	async findAdminByUsername(username: string) {
		const adminsCollection = this.database.getCollection("admins");

		const admin = await adminsCollection.findOne<AdminType>({
			username,
		});
		return admin;
	}
}

export const adminsRepository = new AdminsRepository(db);

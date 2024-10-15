import { ObjectId } from "mongodb";

export type AdminType = {
	username: string;
	password: string;
	_id: ObjectId;
};

export class Admin {
	username: string;
	password: string;
	_id: ObjectId;
	constructor(admin: AdminType) {
		this.username = admin.username;
		this.password = admin.password;
		this._id = admin._id;
	}
}

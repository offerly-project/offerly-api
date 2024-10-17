import { Document } from "mongodb";

export interface IAdmin extends Document {
	username: string;
	password: string;
}

export class Admin {
	username: string;
	password: string;

	constructor(data: IAdmin) {
		this.username = data.username;
		this.password = data.password;
	}
}

import { Document } from "mongodb";

export interface IAdmin extends Document {
	username: string;
	password: string;
}

import { Document, ObjectId } from "mongodb";

export interface ILanguage extends Document {
	_id?: ObjectId;
	name: string;
	code: string;
}

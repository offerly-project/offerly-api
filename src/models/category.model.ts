import { Document, ObjectId } from "mongodb";

export interface ICategory extends Document {
	_id?: ObjectId;
	name: string;
	offers: ObjectId[];
}

import { Document } from "mongodb";

export interface ICategory extends Document {
	_id: string;
	name: string;
}

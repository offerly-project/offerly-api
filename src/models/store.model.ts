import { Document, ObjectId } from "mongodb";
// NON-MVP CODE
export interface IStore extends Document {
	name: string;
	locations: string[];
	logo: string;
	website_link: string;
	offers: ObjectId[];
	_id?: ObjectId;
}

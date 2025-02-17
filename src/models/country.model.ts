import { Document, ObjectId } from "mongodb";

export interface ICountry extends Document {
	_id?: ObjectId;
	name: string;
	phone_code: string;
	country_code: string;
}

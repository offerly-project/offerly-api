import { Document, ObjectId } from "mongodb";

export const LANGUAGES = ["en", "ar"] as const;

export type Language = (typeof LANGUAGES)[number];

export type NotificationTokenType = {
	token: string;
	timestamp: number;
	platform: string;
};

export interface IUser extends Document {
	_id?: ObjectId;
	cards: ObjectId[];
	favorites: ObjectId[];
	email: string;
	password: string;
	full_name: string;
	language?: Language;
	notification_token?: NotificationTokenType[];
}

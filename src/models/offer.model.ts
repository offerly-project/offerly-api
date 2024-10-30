import { Document, ObjectId } from "mongodb";

export type OfferChannel = "online" | "offline";

export interface IOffer extends Document {
	description: string;
	terms_and_conditions: string;
	offer_source_link: string;
	logo?: string;
	discount_code?: string;

	starting_date?: Date;
	expiry_date: Date;
	minimum_amount: number;
	cap?: number;

	channel: OfferChannel;

	categories: string[];
	applicable_cards: ObjectId[];
}

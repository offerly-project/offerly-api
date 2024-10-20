import { Document, ObjectId } from "mongodb";

export type OfferChannel = "online" | "offline";

export type OfferStore = {
	id?: ObjectId;
	location?: string;
};

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
	store: OfferStore;

	categories: ObjectId[];
	applicable_cards: ObjectId[];
}

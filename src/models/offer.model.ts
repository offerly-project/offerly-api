import { Document, ObjectId } from "mongodb";
import { EntityStatus, Translation } from "../ts/global";

export type OfferChannel = "online" | "in-store";

export interface IOffer extends Document {
	description: Translation;
	terms_and_conditions: Translation;
	offer_source_link: string;
	logo?: string;
	discount_code?: string;
	title: Translation;
	starting_date?: Date;
	expiry_date: Date;
	minimum_amount?: number;
	cap?: string;
	status: EntityStatus;
	channels: OfferChannel[];
	categories: string[];
	applicable_cards: ObjectId[];
}

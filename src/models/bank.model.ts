import { Document, ObjectId } from "mongodb";
import { EntityStatus, Translation } from "../ts/global";

export type BankType = "regular" | "digital" | "digital-wallet";

export interface IBank extends Document {
	_id?: ObjectId;
	country: ObjectId;
	type: BankType;
	name: Translation;
	logo?: string;
	status: EntityStatus;
	cards: ObjectId[];
}

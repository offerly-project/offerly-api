import { Document, ObjectId } from "mongodb";
import { EntityStatus } from "../ts/global";

export type BankType = "regular" | "digital" | "digital-wallet";

export interface IBank extends Document {
	_id?: ObjectId;
	country: string;
	type: BankType;
	name: string;
	logo: string;
	status: EntityStatus;
	cards: ObjectId[];
}

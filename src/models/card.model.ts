import { Document, ObjectId } from "mongodb";
import { EntityStatus } from "../ts/global";

export interface ICard extends Document {
	name: string;
	bank: ObjectId;
	logo: string;
	status: EntityStatus;
	grade: string;
	scheme: string;
	offers: ObjectId[];
}

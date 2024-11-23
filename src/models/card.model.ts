import { Document, ObjectId } from "mongodb";
import { EntityStatus, Translation } from "../ts/global";

export interface ICard extends Document {
	_id?: ObjectId;
	name: Translation;
	bank: ObjectId;
	logo?: string;
	status: EntityStatus;
	grade: Translation;
	scheme: Translation;
	offers: ObjectId[];
}

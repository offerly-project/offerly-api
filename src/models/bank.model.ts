import { Document, ObjectId } from "mongodb";
import { EntityStatus } from "../ts/global";

export type BankType = "regular" | "digital" | "digital-wallet";

export interface IBank extends Document {
	country: string;
	type: BankType;
	name: string;
	logo: string;
	status: EntityStatus;
	cards: ObjectId[];
}

export class Bank {
	country: string;
	type: BankType;
	name: string;
	logo: string;
	status: EntityStatus;
	cards: ObjectId[];

	constructor(data: IBank) {
		this.country = data.country;
		this.type = data.type;
		this.name = data.name;
		this.logo = data.logo;
		this.status = data.status;
		this.cards = data.cards;
	}
}

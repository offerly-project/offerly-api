import { Collection } from "mongodb";
import { db } from "../configs/db";

export enum EventsEn {
	NewOffer = "new-offer",
}

type NewOfferEvent = {
	type: EventsEn.NewOffer;
	offer: string;
	cards: string[];
};

type Event = NewOfferEvent;

export class EventsRepository {
	private _collection: Collection<Event>;
	constructor() {
		this._collection = db.getCollection<Event>("events");
	}
	pushEvent = async (event: Event) => {
		try {
			await this._collection.insertOne(event);
		} catch (error) {
			console.error("Error pushing event:", error);
		}
	};

	getEventsByType = async (type: EventsEn) => {
		try {
			return await this._collection.find({ type }).toArray();
		} catch (e) {
			console.error("Error getting events by type:", e);
		}
	};

	clearEventsByType = async (type: EventsEn) => {
		try {
			await this._collection.deleteMany({ type });
		} catch (e) {
			console.error("Error clearing events by type:", e);
		}
	};
}

export const eventsRepository = new EventsRepository();

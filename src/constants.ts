import { OfferChannel } from "./models/offer.model";
import { EntityStatus } from "./ts/global";

export const channels: readonly [OfferChannel, OfferChannel] = [
	"online",
	"in-store",
];

export const entityStatuses: readonly [EntityStatus, EntityStatus] = [
	"enabled",
	"disabled",
];

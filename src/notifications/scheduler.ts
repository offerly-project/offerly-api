import Agenda from "agenda";
import { env } from "../configs/env";
import { pushNotificationsService } from "./notifications";

export const agenda = new Agenda({
	db: { address: env.AGENDA_URL },
});

export const scheduleNewOffers = async (agenda: Agenda) => {
	agenda.define(
		"push-new-offers",
		pushNotificationsService.pushNewOffersNotification
	);
	await agenda.every("30 seconds", "push-new-offers");
};

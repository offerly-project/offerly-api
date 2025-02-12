import cron from "node-cron";
import { pushNotificationsService } from "./notifications";

export const scheduleNewOffers = async () => {
	cron.schedule("*/30 * * * * *", async () => {
		pushNotificationsService.pushNewOffersNotification();
	});
};

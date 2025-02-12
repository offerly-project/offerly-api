import cron from "node-cron";
import { pushNotificationsService } from "./notifications";

export const scheduleNewOffers = async () => {
	cron.schedule("0 */1 * * *", async () => {
		pushNotificationsService.pushNewOffersNotification();
	});
};

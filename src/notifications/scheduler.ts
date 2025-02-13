import cron from "node-cron";
import { pushNotificationsService } from "./notifications";

export const scheduleNewOffersNotifier = async () => {
	cron.schedule("0 */6 * * *", async () => {
		pushNotificationsService.pushNewOffersNotification();
	});
};

export const scheduleExpiringFavouritesNotifier = async () => {
	cron.schedule("0 0 * * *", async () => {
		pushNotificationsService.pushExpiringFavouritesNotification();
	});
};

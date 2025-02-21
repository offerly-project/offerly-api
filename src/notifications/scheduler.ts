import cron from "node-cron";
import { pushNotificationsService } from "./notifications";

export const scheduleNewOffersNotifier = async () => {
	cron.schedule("0 10,14,18 * * *", async () => {
		pushNotificationsService.pushNewOffersNotification();
	});
};

export const scheduleExpiringFavouritesNotifier = async () => {
	cron.schedule("0 12 * * *", async () => {
		pushNotificationsService.pushExpiringFavouritesNotification();
	});
};

import cron from "node-cron";
import { pushNotificationsService } from "./notifications";

export const scheduleNewOffersNotifier = async () => {
	cron.schedule("0 13,20 * * *", async () => {
		pushNotificationsService.pushNewOffersNotification();
	});
};

export const scheduleExpiringFavouritesNotifier = async () => {
	cron.schedule("0 22 * * *", async () => {
		pushNotificationsService.pushExpiringFavouritesNotification();
	});
};

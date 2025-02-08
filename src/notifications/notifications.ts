import { messaging } from "firebase-admin";

type MessagingType = typeof messaging;

export class PushNotificationsService {
	messaging: MessagingType;
	constructor(messaging: MessagingType) {
		this.messaging = messaging;
	}
}

export const pushNotificationsService = new PushNotificationsService(messaging);

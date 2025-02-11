import { messagingInstance } from "./firebase";

type MessagingType = typeof messagingInstance;

export class PushNotificationsService {
	messaging: MessagingType;
	constructor(messaging: MessagingType) {
		this.messaging = messaging;
	}

	sendNotification = async (tokenId: string, title: string, body: string) => {
		try {
			await this.messaging.send({
				token: tokenId,
				notification: {
					title: title,
					body: body,
				},
			});
		} catch (error) {
			console.error("Error sending message:", error);
		}
	};
}

export const pushNotificationsService = new PushNotificationsService(
	messagingInstance
);

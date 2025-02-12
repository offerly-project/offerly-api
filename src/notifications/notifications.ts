import { MulticastMessage } from "firebase-admin/lib/messaging/messaging-api";
import {
	EventsEn,
	eventsRepository,
	EventsRepository,
} from "../repositories/events.repository";
import {
	usersRepository,
	UsersRepository,
} from "../repositories/users.repository";
import { messagingInstance } from "./firebase";

type MessagingType = typeof messagingInstance;

type NotificationUI = {
	title: string;
	body: string;
};

export enum NotificationActions {
	SHOW_SORTED_BY_NEW_ORDERS = "SHOW_SORTED_BY_NEW_ORDERS",
}

export type NewOffersNotificationData = {
	action: NotificationActions.SHOW_SORTED_BY_NEW_ORDERS;
};

export type NotificationPayload = NewOffersNotificationData;

export type NotificationsSentData = {
	notification: NotificationUI;
	payload?: NotificationPayload;
	tokens: string[];
};

export const MAX_MULTICAST_RECEIVERS = 500;

export class PushNotificationsService {
	messaging: MessagingType;
	eventsRepository: EventsRepository;
	usersRepository: UsersRepository;
	constructor(
		messaging: MessagingType,
		eventsRepository: EventsRepository,
		usersRepository: UsersRepository
	) {
		this.messaging = messaging;
		this.eventsRepository = eventsRepository;
		this.usersRepository = usersRepository;
	}

	pushNewOffersNotification = async () => {
		const newOffersEvents = await this.eventsRepository.getEventsByType(
			EventsEn.NewOffer
		);
		if (!newOffersEvents || newOffersEvents.length === 0) return;
		const cardsSet = new Set<string>();
		newOffersEvents.forEach((event) => {
			const { cards } = event;
			cards.forEach((card) => {
				cardsSet.add(card);
			});
		});
		const users = await this.usersRepository.findUsersWithCards(
			Array.from(cardsSet)
		);
		const notifications: NotificationsSentData[] = [];

		users.forEach((user) => {
			if (!user.notification_token) return;

			let matchedOffers = 0;
			newOffersEvents.forEach((ev) => {
				if (
					ev.cards.some((card) =>
						user.cards.some((userCard) => userCard._id.toString() === card)
					)
				) {
					matchedOffers++;
				}
			});

			const userTokens = user.notification_token.map((token) => token.token);

			if (matchedOffers === 0) return;

			const title = matchedOffers > 1 ? "New offers" : "New offer";
			const body =
				matchedOffers > 1
					? `You have ${matchedOffers} new offers`
					: "You have a new offer";

			notifications.push({
				notification: {
					title,
					body,
				},
				payload: {
					action: NotificationActions.SHOW_SORTED_BY_NEW_ORDERS,
				},
				tokens: userTokens,
			});
		});

		await this.eventsRepository.clearEventsByType(EventsEn.NewOffer);

		if (notifications.length === 0) return;

		this.sendNotifications(notifications);
	};

	sendNotifications = async (notifications: NotificationsSentData[]) => {
		try {
			const promises: Promise<any>[] = [];
			for (const notificationData of notifications) {
				const { tokens, notification, payload } = notificationData;
				const message: MulticastMessage = {
					notification,
					data: payload,
					tokens,
				};

				promises.push(this.messaging.sendEachForMulticast(message));
			}
			await Promise.all(promises);
		} catch (error) {
			console.error("Error sending message:", error);
		}
	};
}

export const pushNotificationsService = new PushNotificationsService(
	messagingInstance,
	eventsRepository,
	usersRepository
);

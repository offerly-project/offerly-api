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
	SHOW_SORTED_BY_NEW_ORDERS,
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
			const matchingCards = user.cards.filter((card) =>
				Array.from(cardsSet).includes(card._id.toString())
			);
			const userTokens = user.notification_token.map((token) => token.token);

			const numberOfMatches = matchingCards.length;
			if (numberOfMatches === 0) return;

			if (numberOfMatches > 1) {
				notifications.push({
					notification: {
						title: "New offers",
						body: `You have ${numberOfMatches} new offers`,
					},
					payload: {
						action: NotificationActions.SHOW_SORTED_BY_NEW_ORDERS,
					},
					tokens: userTokens,
				});
			} else {
				notifications.push({
					notification: {
						title: "New offer",
						body: `You have a new offer on card ${matchingCards[0].name}`,
					},
					payload: {
						action: NotificationActions.SHOW_SORTED_BY_NEW_ORDERS,
					},
					tokens: userTokens,
				});
			}
		});
		this.sendNotifications(notifications);
	};

	sendNotifications = async (notifications: NotificationsSentData[]) => {
		try {
			notifications.forEach(async (notificationData) => {
				const { tokens, notification, payload } = notificationData;
				const message: MulticastMessage = {
					notification,
					data: payload as any,
					tokens,
				};
				this.messaging.sendEachForMulticast(message);
			});
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

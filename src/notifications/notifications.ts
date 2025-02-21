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
import { sleep } from "../utils/utils";
import { messagingInstance } from "./firebase";

type MessagingType = typeof messagingInstance;

type NotificationUI = {
	title: string;
	body: string;
};

export enum NotificationActions {
	SHOW_SORTED_BY_NEW_ORDERS = "SHOW_SORTED_BY_NEW_ORDERS",
	EXPIRING_FAVOURITES = "EXPIRING_FAVOURITES",
}

export type NewOffersNotificationData = {
	action: NotificationActions.SHOW_SORTED_BY_NEW_ORDERS;
};

export type ExpiringOffersNotificationData = {
	action: NotificationActions.EXPIRING_FAVOURITES;
	offers: string;
};

export type NotificationPayload =
	| NewOffersNotificationData
	| ExpiringOffersNotificationData;

export type NotificationsSentData = {
	notification: NotificationUI;
	payload?: NotificationPayload;
	tokens: string[];
	userId?: string;
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
		const filteredUsers = users.filter(
			(user) =>
				!!user.notification_token && user.notification_token.length !== 0
		);
		const notifications: NotificationsSentData[] = [];

		filteredUsers.forEach((user) => {
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
				userId: user._id?.toString(),
			});
		});

		await this.eventsRepository.clearEventsByType(EventsEn.NewOffer);

		if (notifications.length === 0) return;

		this.sendNotifications(notifications);
	};

	pushExpiringFavouritesNotification = async () => {
		const users = await this.usersRepository.getUsersFavorites();
		const notifications: NotificationsSentData[] = [];
		const filteredUsers = users.filter(
			(user) =>
				!!user.notification_token && user.notification_token?.length !== 0
		);

		filteredUsers.forEach((user) => {
			const expiringOffers = [];
			for (const favoriteOffer of user.favorites) {
				const expiry = favoriteOffer.expiry_date;
				const diff = expiry.getTime() - Date.now();

				const days = Math.floor(diff / (1000 * 60 * 60 * 24));
				if (days === 7 || days === 3) {
					expiringOffers.push(favoriteOffer.title);
				}
			}
			const notificationUi: NotificationUI = {
				title: "⏳ Hurry Up!",
				body: "Some of your favorite offers will expire soon. Check them out now!",
			};
			notifications.push({
				notification: notificationUi,
				tokens: user.notification_token?.map((token) => token.token)!,
				payload: {
					action: NotificationActions.EXPIRING_FAVOURITES,
					offers: expiringOffers.join(","),
				},
				userId: user._id?.toString(),
			});
		});

		this.sendNotifications(notifications);
	};

	sendNotifications = async (notifications: NotificationsSentData[]) => {
		try {
			for (const notificationData of notifications) {
				const { tokens, notification, payload } = notificationData;
				const message: MulticastMessage = {
					notification,
					data: payload,
					tokens,
				};

				const response = await this.messaging.sendEachForMulticast(message);
				const invalidTokens: string[] = [];
				response.responses.forEach((response, index) => {
					const errorCode = response.error?.code;
					if (
						errorCode === "messaging/invalid-registration-token" ||
						errorCode === "messaging/registration-token-not-registered" ||
						(errorCode === "messaging/invalid-argument" &&
							response.error?.message ===
								"The registration token is not a valid FCM registration token")
					) {
						console.error("Removing invalid token:", response.error?.message);
						invalidTokens.push(tokens[index]);
					}
				});
				this.usersRepository.removeInvalidNotificationTokens(
					notificationData.userId!,
					invalidTokens
				);
				await sleep(1);
			}
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

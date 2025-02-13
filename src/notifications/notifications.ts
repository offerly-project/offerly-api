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
		const filteredUsers = users.filter(
			(user) =>
				!!user.notification_token &&
				user.notification_token.length !== 0 &&
				user.logged_in
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
			});
		});

		await this.eventsRepository.clearEventsByType(EventsEn.NewOffer);

		if (notifications.length === 0) return;

		this.sendNotifications(notifications);
	};

	private _getExpiringFavoritesNotificationBasedOnDays = (
		days: number
	): NotificationUI => {
		const messages: Record<number, { title: string; body: string }> = {
			7: {
				title: "⏳ One Week Left!",
				body: "Some of your favorite offers will expire in 7 days. Don't miss out!",
			},
			3: {
				title: "🔥 Only 3 Days Left!",
				body: "Your favorite offers are expiring in 3 days. Act fast before they’re gone!",
			},
			1: {
				title: "⚠️ Last Chance!",
				body: "One of your favorite offers expires tomorrow. Grab it now before it's too late!",
			},
		};

		return (
			messages[days] ?? {
				title: "⏰ Offer Expiring Soon!",
				body: "Some of your favorite offers are **ending soon**. Check them out now!",
			}
		);
	};

	pushExpiringFavouritesNotification = async () => {
		const users = await this.usersRepository.getUsersFavorites();
		const notifications: NotificationsSentData[] = [];
		const filteredUsers = users.filter(
			(user) =>
				!!user.notification_token &&
				user.notification_token?.length !== 0 &&
				user.logged_in
		);
		filteredUsers.forEach((user) => {
			for (const favoriteOffer of user.favorites) {
				const expiry = favoriteOffer.expiry_date;
				const diff = expiry.getTime() - Date.now();

				const days = diff / (1000 * 60 * 60 * 24);
				if (days === 7 || days === 3 || days === 1) {
					const notificationUi =
						this._getExpiringFavoritesNotificationBasedOnDays(days);
					notifications.push({
						notification: notificationUi,
						tokens: user.notification_token?.map((token) => token.token)!,
					});
					break;
				}
			}
		});

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
				await sleep(2);
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

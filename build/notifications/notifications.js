"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.pushNotificationsService = exports.PushNotificationsService = exports.MAX_MULTICAST_RECEIVERS = exports.NotificationActions = void 0;
const events_repository_1 = require("../repositories/events.repository");
const users_repository_1 = require("../repositories/users.repository");
const utils_1 = require("../utils/utils");
const firebase_1 = require("./firebase");
var NotificationActions;
(function (NotificationActions) {
    NotificationActions["SHOW_SORTED_BY_NEW_ORDERS"] = "SHOW_SORTED_BY_NEW_ORDERS";
    NotificationActions["EXPIRING_FAVOURITES"] = "EXPIRING_FAVOURITES";
})(NotificationActions || (exports.NotificationActions = NotificationActions = {}));
exports.MAX_MULTICAST_RECEIVERS = 500;
class PushNotificationsService {
    constructor(messaging, eventsRepository, usersRepository) {
        this.pushNewOffersNotification = () => __awaiter(this, void 0, void 0, function* () {
            const newOffersEvents = yield this.eventsRepository.getEventsByType(events_repository_1.EventsEn.NewOffer);
            if (!newOffersEvents || newOffersEvents.length === 0)
                return;
            const cardsSet = new Set();
            newOffersEvents.forEach((event) => {
                const { cards } = event;
                cards.forEach((card) => {
                    cardsSet.add(card);
                });
            });
            const users = yield this.usersRepository.findUsersWithCards(Array.from(cardsSet));
            const filteredUsers = users.filter((user) => !!user.notification_token &&
                user.notification_token.length !== 0 &&
                user.logged_in);
            const notifications = [];
            filteredUsers.forEach((user) => {
                if (!user.notification_token)
                    return;
                let matchedOffers = 0;
                newOffersEvents.forEach((ev) => {
                    if (ev.cards.some((card) => user.cards.some((userCard) => userCard._id.toString() === card))) {
                        matchedOffers++;
                    }
                });
                const userTokens = user.notification_token.map((token) => token.token);
                if (matchedOffers === 0)
                    return;
                const title = matchedOffers > 1 ? "New offers" : "New offer";
                const body = matchedOffers > 1
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
            yield this.eventsRepository.clearEventsByType(events_repository_1.EventsEn.NewOffer);
            if (notifications.length === 0)
                return;
            this.sendNotifications(notifications);
        });
        this.pushExpiringFavouritesNotification = () => __awaiter(this, void 0, void 0, function* () {
            const users = yield this.usersRepository.getUsersFavorites();
            const notifications = [];
            const filteredUsers = users.filter((user) => {
                var _a;
                return !!user.notification_token &&
                    ((_a = user.notification_token) === null || _a === void 0 ? void 0 : _a.length) !== 0 &&
                    user.logged_in;
            });
            filteredUsers.forEach((user) => {
                var _a;
                const expiringOffers = [];
                for (const favoriteOffer of user.favorites) {
                    const expiry = favoriteOffer.expiry_date;
                    const diff = expiry.getTime() - Date.now();
                    const days = diff / (1000 * 60 * 60 * 24);
                    if (days === 7 || days === 3 || days === 1) {
                        expiringOffers.push(favoriteOffer._id);
                    }
                }
                const notificationUi = {
                    title: "⏳ Hurry Up!",
                    body: "Some of your favorite offers will expire soon. Check them out now!",
                };
                notifications.push({
                    notification: notificationUi,
                    tokens: (_a = user.notification_token) === null || _a === void 0 ? void 0 : _a.map((token) => token.token),
                    payload: {
                        action: NotificationActions.EXPIRING_FAVOURITES,
                        offers: expiringOffers.join(","),
                    },
                });
            });
            this.sendNotifications(notifications);
        });
        this.sendNotifications = (notifications) => __awaiter(this, void 0, void 0, function* () {
            try {
                const promises = [];
                for (const notificationData of notifications) {
                    const { tokens, notification, payload } = notificationData;
                    const message = {
                        notification,
                        data: payload,
                        tokens,
                    };
                    promises.push(this.messaging.sendEachForMulticast(message));
                    yield (0, utils_1.sleep)(2);
                }
                yield Promise.all(promises);
            }
            catch (error) {
                console.error("Error sending message:", error);
            }
        });
        this.messaging = messaging;
        this.eventsRepository = eventsRepository;
        this.usersRepository = usersRepository;
    }
}
exports.PushNotificationsService = PushNotificationsService;
exports.pushNotificationsService = new PushNotificationsService(firebase_1.messagingInstance, events_repository_1.eventsRepository, users_repository_1.usersRepository);

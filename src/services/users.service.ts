import bcrypt from "bcrypt";
import { env } from "../configs/env";
import {
	ConflictError,
	InternalServerError,
	NotFoundError,
} from "../errors/errors";
import { ErrorCodes } from "../errors/errors.codes";
import { IUser } from "../models/user.model";
import { cardsRepository } from "../repositories/cards.repository";
import { usersRepository } from "../repositories/users.repository";
import { removeUndefinedValuesFromObject } from "../utils/utils";
import {
	GuestContactBodyData,
	PatchUserBodyData,
	SignupUserBodyData,
	UserContactBodyData,
} from "../validators/user.validators";
import { mailService } from "./mail.service";

export const ANNONYMOUS_KEY = "anonymous";

export class UsersService {
	async signupUser(body: SignupUserBodyData) {
		const userDoc = await usersRepository.findByEmail(body.email);
		if (userDoc) {
			throw new ConflictError(
				"User with same email address already exists",
				ErrorCodes.USER_ALREADY_EXISTS
			);
		}
		const hashedPassword = await bcrypt
			.hash(body.password, +env.SALT_ROUNDS)
			.catch((e) => {
				throw new InternalServerError(
					"Failed to hash password",
					ErrorCodes.HASH_ERROR
				);
			});
		const user: IUser = {
			email: body.email,
			password: hashedPassword,
			full_name: body.full_name,
			cards: [],
			favorites: [],
			language: body.language,
			notification_tokens: [],
		};
		return await usersRepository.create(user);
	}
	async updateUserCards(userId: string, cards: string[]) {
		const user = await usersRepository.findById(userId);
		if (!user) {
			throw new NotFoundError(
				"User with this id does not exist",
				ErrorCodes.USER_NOT_FOUND
			);
		}
		const cardsDocs = await cardsRepository.findCards(cards);
		if (cardsDocs.length !== cards.length) {
			throw new NotFoundError("cards not found", ErrorCodes.CARD_NOT_FOUND);
		}
		await usersRepository.updateCards(userId, cards);
	}

	async deleteUserCards(userId: string, cards: string[]) {
		const user = await usersRepository.findById(userId);

		if (!user) {
			throw new NotFoundError(
				"User with this id does not exist",
				ErrorCodes.USER_NOT_FOUND
			);
		}
		const cardsDocs = await cardsRepository.findCards(cards);
		if (cardsDocs.length !== cards.length) {
			throw new NotFoundError("cards not found", ErrorCodes.CARD_NOT_FOUND);
		}
		await usersRepository.removeCards(userId, cards);
	}

	deleteUser = async (userId: string) => {
		const user = await usersRepository.findById(userId);
		if (!user) {
			throw new NotFoundError("User not found", ErrorCodes.USER_NOT_FOUND);
		}
		await usersRepository.update(userId, {
			full_name: ANNONYMOUS_KEY,
			email: ANNONYMOUS_KEY,
			password: ANNONYMOUS_KEY,
		});
	};

	async updateUser(userId: string, data: Partial<PatchUserBodyData>) {
		const user = await usersRepository.findById(userId);
		if (!user) {
			throw new NotFoundError("User not found", ErrorCodes.USER_NOT_FOUND);
		}
		if (data.phone_number) {
			const userDoc = await usersRepository.findByPhone(data.phone_number);

			if (userDoc && !userDoc._id.equals(userId)) {
				throw new ConflictError(
					"User with same phone number already exists",
					ErrorCodes.USER_ALREADY_EXISTS
				);
			}
		}
		let notificationToken = user.notification_token ?? [];

		if (data.notification_token) {
			const index = notificationToken.findIndex(
				(token) => token.device === data.notification_token?.device
			);

			if (index === -1) {
				notificationToken.push(data.notification_token);
			} else {
				notificationToken[index] = data.notification_token;
			}
		}

		const userPatch: Partial<IUser> = removeUndefinedValuesFromObject({
			full_name: data.full_name,
			phone_number: data.phone_number,
			language: data.language,
			notification_token: notificationToken || undefined,
		});
		await usersRepository.update(userId, userPatch);
	}

	async userContact(userId: string, { subject, message }: UserContactBodyData) {
		const user = await usersRepository.findById(userId);
		if (!user) {
			throw new NotFoundError("User not found", ErrorCodes.USER_NOT_FOUND);
		}
		const { full_name, email } = user;
		mailService.sendContactMail(email, full_name, subject, message);
	}

	async guestContact({ email, subject, message }: GuestContactBodyData) {
		mailService.sendContactMail(email, "Guest", subject, message);
	}

	async removeToken(userId: string, token: string) {}
}

export const usersService = new UsersService();

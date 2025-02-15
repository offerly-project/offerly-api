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
			email: body.email.toLowerCase(),
			password: hashedPassword,
			full_name: body.full_name,
			cards: [],
			favorites: [],
			language: body.language,
			notification_tokens: [],
			logged_in: true,
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
		const historicalUser: IUser = {
			...user,
			full_name: "---",
			email: "---",
			password: "---",
		};
		await usersRepository.moveToHistory(historicalUser);

		await usersRepository.deleteUser(userId);
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

		if (
			data.notification_token?.token &&
			!user.notification_token?.find(
				(t) => t.token === data.notification_token?.token
			)
		) {
			notificationToken = [
				...notificationToken,
				{
					token: data.notification_token.token,
					timestamp: data.notification_token.timestamp,
					platform: data.notification_token.platform,
				},
			];
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
}

export const usersService = new UsersService();

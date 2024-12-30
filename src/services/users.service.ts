import bcrypt from "bcrypt";
import { env } from "../configs/env";
import {
	ConflictError,
	InternalServerError,
	NotFoundError,
} from "../errors/errors";
import { IUser } from "../models/user.model";
import { cardsRepository } from "../repositories/cards.repository";
import { usersRepository } from "../repositories/users.repository";
import { removeUndefinedValuesFromObject } from "../utils/utils";
import {
	PatchUserBodyData,
	SignupUserBodyData,
} from "../validators/user.validators";

export const ANNONYMOUS_KEY = "anonymous";

export class UsersService {
	async signupUser(body: SignupUserBodyData) {
		const userDoc = await usersRepository.findByEmail(body.email);
		if (userDoc) {
			throw new ConflictError("User with same email address already exists");
		}
		const hashedPassword = await bcrypt
			.hash(body.password, +env.SALT_ROUNDS)
			.catch((e) => {
				throw new InternalServerError("Failed to hash password");
			});
		const user: IUser = {
			email: body.email,
			password: hashedPassword,
			full_name: body.full_name,
			cards: [],
			favorites: [],
		};
		await usersRepository.create(user);
	}
	async updateUserCards(userId: string, cards: string[]) {
		const user = await usersRepository.findById(userId);
		if (!user) {
			throw new ConflictError("User with this id does not exist");
		}
		const cardsDocs = await cardsRepository.findCards(cards);
		if (cardsDocs.length !== cards.length) {
			throw new NotFoundError("cards not found");
		}
		await usersRepository.updateCards(userId, cards);
	}

	async deleteUserCards(userId: string, cards: string[]) {
		const user = await usersRepository.findById(userId);

		if (!user) {
			throw new ConflictError("User with this id does not exist");
		}
		const cardsDocs = await cardsRepository.findCards(cards);
		if (cardsDocs.length !== cards.length) {
			throw new NotFoundError("cards not found");
		}
		await usersRepository.removeCards(userId, cards);
	}

	deleteUser = async (userId: string) => {
		const user = await usersRepository.findById(userId);
		if (!user) {
			throw new NotFoundError("User not found");
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
			throw new NotFoundError("User not found");
		}
		if (data.phone_number) {
			const userDoc = await usersRepository.findByPhone(data.phone_number);
			if (userDoc) {
				throw new ConflictError("User with same phone number already exists");
			}
		}
		const userPatch: Partial<IUser> = removeUndefinedValuesFromObject({
			full_name: data.full_name,
			phone_number: data.phone_number,
		});
		await usersRepository.update(userId, userPatch);
	}
}

export const usersService = new UsersService();

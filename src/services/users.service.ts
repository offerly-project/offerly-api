import bcrypt from "bcrypt";
import { env } from "../configs/env";
import { ConflictError, InternalServerError } from "../errors/errors";
import { IUser } from "../models/user.model";
import { usersRepository } from "../repositories/users.repository";
import { SignupUserBodyData } from "../validators/users.validators";

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
}

export const usersService = new UsersService();

import bcrypt from "bcrypt";
import { omit } from "lodash";
import { env } from "../configs/env";
import {
	BadRequestError,
	NotFoundError,
	UnauthorizedError,
} from "../errors/errors";
import { ErrorCodes } from "../errors/errors.codes";
import { adminsRepository } from "../repositories/admins.repository";
import { usersRepository } from "../repositories/users.repository";
import { generateToken, validatePassword } from "../utils/utils";
import { ANNONYMOUS_KEY } from "./users.service";

export class AdminAuthService {
	async login(username: string, password: string) {
		const admin = await adminsRepository.findByUsername(username);
		if (!admin) {
			throw new NotFoundError("User not found", ErrorCodes.USER_NOT_FOUND);
		}
		const validPassword = await validatePassword(password, admin.password);
		if (!validPassword) {
			throw new BadRequestError(
				"Incorrect password",
				ErrorCodes.INCORRECT_PASSWORD
			);
		}
		const token = await generateToken(admin._id.toString(), "admin", "login");
		return { token, admin: omit(admin, ["password", "_id"]) };
	}
}

export class UserAuthService {
	async login(email: string, password: string) {
		if (email === ANNONYMOUS_KEY) {
			throw new UnauthorizedError(
				"Anonymous user cannot login",
				ErrorCodes.UNAUTHORIZED
			);
		}
		const user = await usersRepository.findByEmail(email);
		if (!user) {
			throw new NotFoundError("User not found", ErrorCodes.USER_NOT_FOUND);
		}
		const validPassword = await validatePassword(password, user.password);
		if (!validPassword) {
			throw new BadRequestError(
				"Incorrect password",
				ErrorCodes.INCORRECT_PASSWORD
			);
		}
		const token = await generateToken(user._id.toString(), "user", "login");
		return {
			token,
			user: omit(user, ["password", "_id"]),
		};
	}

	async changePassword(id: string, password: string) {
		const hash = await bcrypt.hash(password, +env.SALT_ROUNDS);
		await usersRepository.updatePassword(id, hash);
	}

	async changePasswordWithOldPassword(
		id: string,
		oldPassword: string,
		newPassword: string
	) {
		const user = await usersRepository.findById(id);
		if (!user) {
			throw new NotFoundError("User not found", ErrorCodes.USER_NOT_FOUND);
		}
		const validPassword = await validatePassword(oldPassword, user.password);
		if (!validPassword) {
			throw new BadRequestError(
				"Incorrect password",
				ErrorCodes.INCORRECT_PASSWORD
			);
		}
		this.changePassword(id, newPassword);
	}
}

export const adminAuthService = new AdminAuthService();
export const userAuthService = new UserAuthService();

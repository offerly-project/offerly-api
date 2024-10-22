import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { env } from "../configs/env";
import {
	BadRequestError,
	InternalServerError,
	NotFoundError,
} from "../errors/errors";
import { adminsRepository } from "../repositories/admins.repository";
import { UserRole } from "../ts/global";

export class AuthService {
	async adminLogin(username: string, password: string) {
		const admin = await adminsRepository.findOneByUsername(username);
		if (!admin) {
			throw new NotFoundError("User not found");
		}
		const validPassword = await this._validateLogin(password, admin.password);
		if (!validPassword) {
			throw new BadRequestError("Incorrect password");
		}
		const token = await this.generateToken(admin.username, "admin");
		return { token, admin: admin.username };
	}

	private async _validateLogin(
		password: string,
		hash: string
	): Promise<boolean> {
		return new Promise((resolve, reject) => {
			bcrypt.compare(password, hash).then(resolve).catch(reject);
		});
	}
	async generateToken(username: string, role: UserRole): Promise<string> {
		return new Promise((resolve, reject) => {
			jwt.sign({ username, role }, env.PRIVATE_KEY, ((err, token) => {
				if (err || !token) {
					reject(new InternalServerError("failed to generate token"));
				}
				if (token) resolve(token);
			}) as jwt.SignCallback);
		});
	}
}

export const authService = new AuthService();

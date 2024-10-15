import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { env } from "../configs/env";
import { InternalServerError } from "../errors/errors";
import { UserRole } from "../ts/users.types";

export class AuthService {
	async validateLogin(password: string, hash: string): Promise<boolean> {
		console.log(password, hash);

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

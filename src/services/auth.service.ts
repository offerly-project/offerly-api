import bcrypt from "bcrypt";
import ejs from "ejs";
import jwt from "jsonwebtoken";
import path from "path";
import { env } from "../configs/env";
import { redis } from "../configs/redis";
import {
	BadRequestError,
	InternalServerError,
	NotFoundError,
} from "../errors/errors";
import { adminsRepository } from "../repositories/admins.repository";
import { usersRepository } from "../repositories/users.repository";
import { UserRole } from "../ts/global";
import { mailService } from "./mail.service";
import { otpService } from "./otp.service";

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
		const token = await this.generateToken(admin._id.toString(), "admin");
		return { token, admin: admin.username };
	}

	async userLogin(email: string, password: string) {
		const user = await usersRepository.findByEmail(email);
		if (!user) {
			throw new NotFoundError("User not found");
		}
		const validPassword = await this._validateLogin(password, user.password);
		if (!validPassword) {
			throw new BadRequestError("Incorrect password");
		}
		const token = await this.generateToken(user._id.toString(), "user");
		return {
			token,
			user: {
				email: user.email,
				full_name: user.full_name,
			},
		};
	}

	private async _validateLogin(
		password: string,
		hash: string
	): Promise<boolean> {
		return bcrypt.compare(password, hash);
	}
	async generateToken(id: string, role: UserRole): Promise<string> {
		return new Promise((resolve, reject) => {
			jwt.sign({ id, role }, env.PRIVATE_KEY, ((err, token) => {
				if (err || !token) {
					reject(new InternalServerError("failed to generate token"));
				}
				if (token) resolve(token);
			}) as jwt.SignCallback);
		});
	}

	async forgotPassword(email: string) {
		const hasOtp = await otpService.doesUserHaveOtp(email);

		if (hasOtp) {
			throw new BadRequestError("An OTP has already been sent to your email");
		}

		const otp = otpService.generateOtp();

		try {
			await redis.client.setex(`otps:${email}`, 60, otp);
		} catch {
			throw new InternalServerError("Failed to generate OTP");
		}

		const html = await ejs.renderFile(
			path.join(__dirname, "../templates/otp.ejs"),
			{ otp }
		);
		try {
			mailService.sendMail(email, "Password Reset OTP", html);
		} catch (e) {
			console.log(e);
		}
	}
}

export const authService = new AuthService();

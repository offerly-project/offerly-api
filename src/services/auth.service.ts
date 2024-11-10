import bcrypt from "bcrypt";
import ejs from "ejs";
import path from "path";
import { env } from "../configs/env";
import { BadRequestError, NotFoundError } from "../errors/errors";
import { adminsRepository } from "../repositories/admins.repository";
import { usersRepository } from "../repositories/users.repository";
import { generateToken, validatePassword } from "../utils/utils";
import { mailService } from "./mail.service";
import { otpService } from "./otp.service";

export class AdminAuthService {
	async login(username: string, password: string) {
		const admin = await adminsRepository.findOneByUsername(username);
		if (!admin) {
			throw new NotFoundError("User not found");
		}
		const validPassword = await validatePassword(password, admin.password);
		if (!validPassword) {
			throw new BadRequestError("Incorrect password");
		}
		const token = await generateToken(admin._id.toString(), "admin");
		return { token, admin: admin.username };
	}
}

export class UserAuthService {
	async login(email: string, password: string) {
		const user = await usersRepository.findByEmail(email);
		if (!user) {
			throw new NotFoundError("User not found");
		}
		const validPassword = await validatePassword(password, user.password);
		if (!validPassword) {
			throw new BadRequestError("Incorrect password");
		}
		const token = await generateToken(user._id.toString(), "user");
		return {
			token,
			user: {
				email: user.email,
				full_name: user.full_name,
			},
		};
	}

	async forgotPassword(email: string) {
		const otp = otpService.sendOtp(email);

		if (otp.code === null) {
			throw new BadRequestError(
				`You can request for OTP only after ${otp.timer} milliseconds of the request`
			);
		}

		const html = await ejs.renderFile(
			path.join(__dirname, "../templates/otp.ejs"),
			{ otp: otp.code }
		);
		mailService.sendMail(email, "Password Reset OTP", html);
		return otp;
	}

	async changePassword(id: string, password: string) {
		const hash = await bcrypt.hash(password, +env.SALT_ROUNDS);
		await usersRepository.updatePassword(id, hash);
	}
}

export const adminAuthService = new AdminAuthService();
export const userAuthService = new UserAuthService();

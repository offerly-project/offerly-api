import { randomBytes } from "crypto";
import { redis } from "../configs/redis";

export class OTPService {
	generateOtp = (length = 4) => {
		const otpArray = randomBytes(length);
		return Array.from(otpArray, (num) => num % 10).join("");
	};

	doesUserHaveOtp = async (email: string) => {
		const otp = await redis.client.get(`otps:${email}`);

		return otp;
	};
}

export const otpService = new OTPService();

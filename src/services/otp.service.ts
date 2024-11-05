import { randomBytes } from "crypto";

export class OTPService {
	otps: Record<string, string> = {};
	generateOtp = (length = 4) => {
		const otpArray = randomBytes(length);
		return Array.from(otpArray, (num) => num % 10).join("");
	};

	saveOtp = async (email: string, otp: string) => {
		this.otps[email] = otp;
		setTimeout(() => {
			delete this.otps[email];
		}, 1000 * 60);
	};

	doesUserHaveOtp = async (email: string) => {
		return !!this.otps[email];
	};
}

export const otpService = new OTPService();

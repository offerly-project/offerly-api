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
			this.deleteOtp(email);
		}, 1000 * 60);
	};

	doesUserHaveOtp = (email: string) => {
		return this.otps[email] !== undefined;
	};

	verifyOtp = (email: string, otp: string) => {
		const userOtp = this.otps[email];
		if (!userOtp) {
			return false;
		}

		return userOtp === otp;
	};

	deleteOtp = async (email: string) => {
		delete this.otps[email];
		console.log(this.otps);
	};
}

export const otpService = new OTPService();

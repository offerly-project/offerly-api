import { OTP } from "../models/otp.model";

export class OTPService {
	otps: Record<string, OTP> = {};

	hasOtp = (email: string) => {
		return !!this.otps[email];
	};

	sendOtp = (email: string) => {
		if (this.otps[email]) {
			if (this.otps[email].requestable) {
				this.otps[email].requestOtp();
				return {
					code: this.otps[email].code,
					timer: this.otps[email].requestTimer,
				};
			} else {
				return {
					code: null,
					timer: this.otps[email].requestTimer,
				};
			}
		} else {
			this.otps[email] = new OTP();
			this.otps[email].requestOtp();
			setTimeout(() => {
				this.deleteOtp(email);
			}, 75 * 60 * 1000);
			return {
				code: this.otps[email].code,
				timer: this.otps[email].requestTimer,
			};
		}
	};

	verifyOtp = (email: string, otp: string) => {
		const userOtp = this.otps[email];
		if (!userOtp) {
			return false;
		}
		const verified = userOtp.validateOtp(otp);

		return verified;
	};

	deleteOtp = async (email: string) => {
		delete this.otps[email];
	};
}

export const otpService = new OTPService();

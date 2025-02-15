import { BadRequestError } from "../errors/errors";
import { OTP, OTP_SECONDS_BUFFER } from "../models/otp.model";
import { JWTSource } from "../utils/utils";

export class OTPService {
	private _otps: Record<string, OTP> = {};

	requestOtp = (email: string, source: JWTSource) => {
		const otpInstance = this._otps[email];
		if (otpInstance) {
			if (otpInstance.canRequest()) {
				return otpInstance.init();
			} else {
				throw new BadRequestError(
					`Please wait for ${OTP_SECONDS_BUFFER} seconds before requesting another OTP`
				);
			}
		} else {
			this._otps[email] = new OTP(source);
			return this._otps[email].init();
		}
	};

	hasOtp = (email: string) => {
		return !!this._otps[email];
	};

	verifyOtp = async (email: string, code: string) => {
		const otpInstance = this._otps[email];
		if (!otpInstance) {
			return false;
		}
		const verified = await otpInstance.verify(code);

		if (verified) {
			delete this._otps[email];
		}

		return verified;
	};

	getOtp = (email: string) => {
		return this._otps[email];
	};

	shouldCleanup = () => {
		return Object.values(this._otps).every((otp) => otp.isExpired());
	};

	reset = () => {
		Object.values(this._otps).forEach((otp) => otp.clearTimeouts());
		this._otps = {};
	};
}

export const otpService = new OTPService();

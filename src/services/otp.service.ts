import { BadRequestError } from "../errors/errors";
import { OTP, OTP_EXPIRY_SECONDS } from "../models/otp.model";
import { JWTPermissions } from "../utils/utils";

export class OTPService {
	private _otps: Record<string, OTP> = {};

	requestOtp = (email: string, permissions: JWTPermissions[]) => {
		const otpInstance = this._otps[email];
		if (otpInstance) {
			if (otpInstance.canRequest()) {
				return otpInstance.init();
			} else {
				throw new BadRequestError(
					`Please wait for ${OTP_EXPIRY_SECONDS} seconds before requesting another OTP`
				);
			}
		} else {
			this._otps[email] = new OTP(permissions);
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
}

export const otpService = new OTPService();

import bcrypt from "bcrypt";
import { randomBytes } from "crypto";
import { env } from "../configs/env";

export const OTP_EXPIRY = 0.5 * (60 * 1000);

export const OTP_EXPIRY_SECONDS = OTP_EXPIRY / 1000;

export const OTP_LENGTH = 4;

export class OTP {
	private _code: string | null = null;
	private _pending = true;

	private _generateOtp = () => {
		const otpArray = randomBytes(OTP_LENGTH);
		return Array.from(otpArray, (num) => num % 10).join("");
	};

	private _startTimer = () => {
		setTimeout(() => {
			this._code = null;
			this._pending = false;
		}, OTP_EXPIRY);
	};

	init = () => {
		this._pending = true;
		return new Promise<{ code: string; expiry: number }>((resolve, reject) => {
			const otpGenerated = this._generateOtp();
			bcrypt.hash(otpGenerated, +env.SALT_ROUNDS, (err, hash) => {
				if (err) {
					reject(err);
				}

				this._code = hash;
				this._startTimer();
				resolve({ code: otpGenerated, expiry: OTP_EXPIRY_SECONDS });
			});
		});
	};

	canRequest = () => {
		return !this._pending;
	};

	verify = (code: string) => {
		return new Promise<boolean>((resolve, reject) => {
			if (!this._code) {
				resolve(false);
				return;
			}
			bcrypt.compare(code, this._code, (err, same) => {
				if (err) {
					reject(err);
				}

				resolve(same);
			});
		});
	};
}

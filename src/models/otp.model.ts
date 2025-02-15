import bcrypt from "bcrypt";
import { randomBytes } from "crypto";
import { env } from "../configs/env";
import { JWTSource } from "../utils/utils";

// 30 seconds
export const OTP_REREQUEST = 0.5 * (60 * 1000);

// 30 minutes
export const OTP_BUFFER = 30 * 60 * 1000;

export const OTP_SECONDS_BUFFER = OTP_REREQUEST / 1000;

export const OTP_LENGTH = 4;

export class OTP {
	private _code: string | null = null;
	private _pending = true;
	source: JWTSource = "login";
	private _timeouts: NodeJS.Timeout[] = [];

	private _generateOtp = () => {
		const otpArray = randomBytes(OTP_LENGTH);
		return Array.from(otpArray, (num) => num % 10).join("");
	};

	public clearTimeouts = () => {
		this._timeouts.forEach((timeout) => {
			clearTimeout(timeout);
		});
		this._timeouts = [];
	};

	private _startTimer = () => {
		this._timeouts.push(
			setTimeout(() => {
				this._pending = false;
			}, OTP_REREQUEST),
			setTimeout(() => {
				this._code = null;
			}, OTP_BUFFER)
		);
	};

	constructor(source: JWTSource) {
		this.source = source;
	}

	init = () => {
		this._pending = true;
		return new Promise<{ code: string; expiry: number }>((resolve, reject) => {
			const otpGenerated = this._generateOtp();
			bcrypt.hash(otpGenerated, +env.SALT_ROUNDS, (err, hash) => {
				if (err) {
					reject(err);
				}

				this._code = hash;
				this.clearTimeouts();
				this._startTimer();
				resolve({ code: otpGenerated, expiry: OTP_SECONDS_BUFFER });
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

	isExpired = () => {
		return this._code === null;
	};
}

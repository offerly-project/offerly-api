import { randomBytes } from "crypto";

export class OTP {
	code!: string;
	requestable: boolean;
	requestNumber: number;
	requestTimer!: number;
	usable: boolean;

	private intervals = [1, 5, 15, 30, 60].map((minutes) => minutes * 60 * 1000);

	validateOtp(otp: string) {
		const valid = +this.code === +otp && this.usable;
		if (valid) this.setToUnusable();
		return valid;
	}

	constructor() {
		this.requestNumber = 0;
		this.requestable = true;
		this.usable = true;
	}

	setToUnusable() {
		this.usable = false;
	}

	private _generateOtp = (length = 4) => {
		const otpArray = randomBytes(length);
		return Array.from(otpArray, (num) => num % 10).join("");
	};

	canRequest() {
		return this.requestNumber < this.intervals.length;
	}

	startTimer() {
		const timer = this.intervals[this.requestNumber];
		this.requestTimer = timer;

		this.requestable = false;
		setTimeout(() => {
			this.requestable = true;
			this.requestNumber++;
		}, timer);
	}

	requestOtp() {
		if (!this.canRequest()) throw new Error("Maximum OTP requests reached");

		const otp = this._generateOtp();
		this.code = otp;
		this.startTimer();
		return otp;
	}
}

import { otpService } from "../services/otp.service";

export class OTPGarbageCollector {
	private static _interval = 1 * 60 * 60 * 1000; // 1 Hours
	static start = () => {
		setInterval(() => {
			if (otpService.shouldCleanup()) {
				otpService.reset();
			}
		}, this._interval);
	};
}

export const startGarbageCollectors = () => {
	OTPGarbageCollector.start();
};

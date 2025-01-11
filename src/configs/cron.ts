import cron from "node-cron";
import { offersRepository } from "../repositories/offers.repository";

export class CronJobs {
	private static _logJob =
		(cb: () => Promise<any>) => (job: string) => async () => {
			try {
				console.log(`${job} Job has started...`);
				await cb();
				console.log(`${job} Job has finished...`);
			} catch (e) {
				console.error(e);
				console.log(`${job} Job has failed...`);
			}
		};

	private static _offersExpiryJob = () => {
		cron.schedule(
			"0 0 * * 0",
			this._logJob(offersRepository.disableExpiredOffers)("offers expiry")
		);
	};

	static start() {
		this._offersExpiryJob();
	}
}

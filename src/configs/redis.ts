import IORedis from "ioredis";
import { env } from "./env";

export class Redis {
	private _client: IORedis;
	constructor() {
		this._client = new IORedis({
			host: env.REDIS_URL,
			port: +env.REDIS_PORT,
			lazyConnect: true,
		});
	}

	async connect() {
		try {
			await this._client.connect();
		} catch (e) {
			throw e;
		}
	}

	async disconnect() {
		this._client.disconnect();
	}

	get client() {
		return this._client;
	}
}

export const redis = new Redis();

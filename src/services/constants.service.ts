import fs from "fs";
import { env } from "../configs/env";

export class ConstantsService {
	static async getCategories(): Promise<string[]> {
		return new Promise((resolve, reject) => {
			fs.readFile(env.DATA_DIR + "/categories.json", "utf-8", (err, data) => {
				if (err) {
					reject(err);
				}
				return resolve(JSON.parse(data));
			});
		});
	}
	static async getCountries(): Promise<string[]> {
		return new Promise((resolve, reject) => {
			fs.readFile(env.DATA_DIR + "/countries.json", "utf-8", (err, data) => {
				if (err) {
					reject(err);
				}
				return resolve(JSON.parse(data));
			});
		});
	}

	static async getLanguages(): Promise<string[]> {
		return new Promise((resolve, reject) => {
			fs.readFile(env.DATA_DIR + "/languages.json", "utf-8", (err, data) => {
				if (err) {
					reject(err);
				}
				return resolve(JSON.parse(data));
			});
		});
	}
}

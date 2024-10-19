import fs from "fs";
import path from "path";
import { env } from "./env";

export const UPLOAD_DIRECTORIES = ["/banks", "/offers", "/cards"] as const;

export type UploadDirectory = (typeof UPLOAD_DIRECTORIES)[number];

export const createUploadDirectories = () => {
	UPLOAD_DIRECTORIES.forEach((dir) => {
		const fullPath = path.join(__dirname, env.DATA_DIR, dir);

		if (!fs.existsSync(fullPath)) {
			fs.mkdirSync(fullPath, { recursive: true });
		}
	});
};

export const UPLOAD_DIRECTORIES = ["/banks", "/offers", "/cards"] as const;

export type UploadDirectory = (typeof UPLOAD_DIRECTORIES)[number];

import fs from "fs";
import { env } from "./env";

export const createUploadDirectories = async () => {
	for (const directoryName of UPLOAD_DIRECTORIES) {
		const path = `${env.UPLOADS_DIR}${directoryName}`;
		await fs.promises.mkdir(path, {
			recursive: true,
		});
		console.log(`Directory ${path} created`);
	}
};

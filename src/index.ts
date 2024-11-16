import cookieParser from "cookie-parser";
import cors from "cors";
import dotenv from "dotenv";
import express, { json, urlencoded } from "express";
import morgan from "morgan";
import { db } from "./configs/db";
import { env } from "./configs/env";
import { createUploadDirectories } from "./configs/files";
import { CORS_OPTIONS } from "./configs/options";
import { errorsMiddleware } from "./middlewares/errors.middleware";
import { adminRouter, userRouter } from "./routers/routers";
import { uploadsRouter } from "./routers/uploads.router";

dotenv.config();

(async function () {
	createUploadDirectories();

	await db.connect();

	const app = express();

	app.use(morgan("common"));

	app.use(urlencoded({ extended: true }));

	app.use(cookieParser());

	app.use(json());

	app.use(cors(CORS_OPTIONS));

	app.use("/uploads", uploadsRouter);

	app.use("/admin", adminRouter);

	app.use("/user", userRouter);

	app.use(errorsMiddleware);

	app.use("/static", express.static(env.DATA_DIR));

	app.listen(env.PORT, () => {
		console.log(`Server is running on port ${env.PORT}`);
	});
})();

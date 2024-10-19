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
import { authRouter } from "./routers/auth.router";
import { banksRouter } from "./routers/banks.router";
import { cardsRouter } from "./routers/cards.router";
import { uploadsRouter } from "./routers/uploads.router";

dotenv.config();

(async function () {
	createUploadDirectories();

	await db.connect();

	const app = express();

	app.use(morgan("common"));

	app.use(urlencoded({ extended: true }));

	app.use("/uploads", uploadsRouter);

	app.use(cookieParser());

	app.use(json());

	app.use(cors(CORS_OPTIONS));

	app.use("/auth", authRouter);

	app.use("/banks", banksRouter);

	app.use("/cards", cardsRouter);

	app.use(errorsMiddleware);

	app.use("/static", express.static("data"));

	app.listen(env.PORT, () => {
		console.log(`Server is running on port ${env.PORT}`);
	});
})();

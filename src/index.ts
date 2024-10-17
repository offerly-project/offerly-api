import cookieParser from "cookie-parser";
import cors from "cors";
import dotenv from "dotenv";
import express, { json, urlencoded } from "express";
import morgan from "morgan";
import { db } from "./configs/db";
import { env } from "./configs/env";
import { CORS_OPTIONS } from "./configs/options";
import { uploadHandler } from "./controllers/upload.controller";
import { errorsMiddleware } from "./middlewares/errors.middleware";
import { authRouter } from "./routers/auth.router";
import { banksRouter } from "./routers/banks.router";

dotenv.config();

(async function () {
	await db.connect();

	const app = express();

	app.use(morgan("common"));

	app.use(urlencoded({ extended: true }));

	app.post("/uploads", uploadHandler);

	app.use(cookieParser());

	app.use(json());

	app.use(cors(CORS_OPTIONS));

	app.use("/auth", authRouter);

	app.use("/banks", banksRouter);

	app.use(errorsMiddleware);

	app.use("/static", express.static("data"));

	app.listen(env.PORT, () => {
		console.log(`Server is running on port ${env.PORT}`);
	});
})();

import cookieParser from "cookie-parser";
import cors from "cors";
import dotenv from "dotenv";
import express, { json } from "express";
import morgan from "morgan";
import { db } from "./configs/db";
import { env } from "./configs/env";
import { CORS_OPTIONS } from "./configs/options";
import { errorsMiddleware } from "./middlewares/errors.middleware";
import { authRouter } from "./routers/auth.router";

dotenv.config();

(async function () {
	await db.connect();

	const app = express();

	app.use(morgan("common"));

	app.use(cookieParser());

	app.use(json());

	app.use(cors(CORS_OPTIONS));

	app.use("/auth", authRouter);

	app.use(errorsMiddleware);

	app.listen(env.PORT, () => {
		console.log(`Server is running on port ${env.PORT}`);
	});
})();

import cookieParser from "cookie-parser";
import cors from "cors";
import dotenv from "dotenv";
import express, {
	json,
	NextFunction,
	Request,
	Response,
	urlencoded,
} from "express";
import morgan from "morgan";
import swaggerUi from "swagger-ui-express";
import { db } from "./configs/db";
import { env } from "./configs/env";
import { startGarbageCollectors } from "./configs/garbage-collector";
import { CORS_OPTIONS } from "./configs/options";
import { errorsMiddleware } from "./middlewares/errors.middleware";
import { queryMiddleware } from "./middlewares/query.middleware";
import { pushNotificationsService } from "./notifications/notifications";
import { otpRouter } from "./routers/otp.router";
import { adminRouter, userRouter } from "./routers/routers";
import { uploadsRouter } from "./routers/uploads.router";
import swaggerJson from "./swagger.json";

dotenv.config();

(async function () {
	await db.connect();

	const app = express();

	app.use(morgan("common"));

	app.use(urlencoded({ extended: true }));

	app.use(cookieParser());

	app.use(json());

	app.use(queryMiddleware);

	app.use(cors(CORS_OPTIONS));

	app.use("/uploads", uploadsRouter);

	app.use("/otp", otpRouter);

	app.use("/admin", adminRouter);

	app.use("/user", userRouter);

	app.post(
		"/notify",
		(
			req: Request<{}, {}, { token: string; title: string; body: string }>,
			res: Response,
			next: NextFunction
		) => {
			const { token, title, body } = req.body;
			pushNotificationsService.sendNotification(token, title, body);
			res.json({ message: "Notification Sent" });
		}
	);

	if (env.NODE_ENV === "development") {
		app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerJson));
	}

	app.get("/health", (req, res) => {
		res.json({ status: "healthy!" });
	});

	console.log(env.DATA_DIR);
	console.log(env.UPLOADS_DIR);

	app.use("/uploads", express.static(env.UPLOADS_DIR));
	app.use("/static", express.static(env.DATA_DIR));

	app.use(errorsMiddleware);

	startGarbageCollectors();

	app.listen(env.PORT, () => {
		console.log(`Server is running on port ${env.PORT}`);
	});
})();

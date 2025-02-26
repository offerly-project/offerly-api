import cookieParser from "cookie-parser";
import cors from "cors";
import dotenv from "dotenv";
import express, { json, urlencoded } from "express";
import morgan from "morgan";
import swaggerUi from "swagger-ui-express";
import { db } from "./configs/db";
import { env } from "./configs/env";
import { createUploadDirectories } from "./configs/files";
import { startGarbageCollectors } from "./configs/garbage-collector";
import { CORS_OPTIONS } from "./configs/options";
import { errorsMiddleware } from "./middlewares/errors.middleware";
import { queryMiddleware } from "./middlewares/query.middleware";
import {
	scheduleExpiringFavouritesNotifier,
	scheduleNewOffersNotifier,
} from "./notifications/scheduler";
import { otpRouter } from "./routers/otp.router";
import { adminRouter, userRouter } from "./routers/routers";
import { staticRouter } from "./routers/static.router";
import { uploadsRouter } from "./routers/uploads.router";
import swaggerJson from "./swagger.json";

dotenv.config();

(async function () {
	await createUploadDirectories();
	await db.connect();

	scheduleNewOffersNotifier();
	scheduleExpiringFavouritesNotifier();

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

	app.use("/static", staticRouter);

	if (env.NODE_ENV === "development") {
		app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerJson));
	}

	app.get("/health-check", (req, res) => {
		res.json({ status: "API is healthy!" });
	});

	console.log(env.UPLOADS_DIR);

	app.use("/uploads", express.static(env.UPLOADS_DIR));

	app.use(errorsMiddleware);

	startGarbageCollectors();

	// (async () => {
	// 	const offers: any[] = await db.getCollection("offers").find().toArray();
	// 	for (const offer of offers) {
	// 		if (!offer.applicable_cards.length) continue;
	// 		cardsRepository
	// 			.findById(offer.applicable_cards[0].toString())
	// 			.then(async (card) => {
	// 				const bankId = card?.bank._id;
	// 				console.log(offer.title.en);

	// 				if (offer.title.en === "DragonPass") {
	// 					console.log(bankId);
	// 				}

	// 				await offersRepository.update(offer._id.toString(), {
	// 					bankId: bankId,
	// 				});
	// 			});
	// 	}
	// })();

	app.listen(env.PORT, () => {
		console.log(`Server is running on port ${env.PORT}`);
	});
})();

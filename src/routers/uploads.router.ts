import { Router } from "express";
import { imageUploadMiddleware } from "../middlewares/uploads.middleware";

export const uploadsRouter = Router();

uploadsRouter.post(
	"/images",
	imageUploadMiddleware({
		allowCustomDimensions: true,
		allowedPaths: ["/banks", "/offers", "/cards"],
	})
);

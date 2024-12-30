import { Router } from "express";
import { otpController } from "../controllers/otp.controller";
import { validateRequest } from "../utils/utils";
import {
	otpGenerationSchema,
	otpVerificationSchema,
} from "../validators/otp.validators";

export const otpRouter = Router();

otpRouter.post(
	"/verify",
	validateRequest(otpVerificationSchema),
	otpController.verifyUserOtpHandler
);

otpRouter.post(
	"/generate",
	validateRequest(otpGenerationSchema),
	otpController.generateUserOtpHandler
);

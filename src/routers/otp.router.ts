import { Router } from "express";
import { otpController } from "../controllers/otp.controller";

export const otpRouter = Router();

otpRouter.post("/verify", otpController.verifyOtpHandler);

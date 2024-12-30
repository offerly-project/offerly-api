import { z } from "zod";
import { jwtSources } from "../utils/utils";

export const otpVerificationSchema = z.object({
	body: z.object({
		otp: z.string().length(4),
		email: z.string(),
	}),
});

export const otpGenerationSchema = z.object({
	body: z.object({
		email: z.string(),
		source: z.enum(jwtSources),
	}),
});

export type OTPVerificationBody = z.infer<typeof otpVerificationSchema>["body"];

export type OTPGenerationBody = z.infer<typeof otpGenerationSchema>["body"];

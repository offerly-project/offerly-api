import { z } from "zod";
import { jwtPermissions } from "../utils/utils";

export const otpVerificationSchema = z.object({
	body: z.object({
		otp: z.string().length(4),
		email: z.string(),
	}),
});

export const otpGenerationSchema = z.object({
	body: z.object({
		email: z.string(),
		permissions: z.array(z.enum(jwtPermissions)).min(1),
	}),
});

export type OTPVerificationBody = z.infer<typeof otpVerificationSchema>["body"];

export type OTPGenerationBody = z.infer<typeof otpGenerationSchema>["body"];

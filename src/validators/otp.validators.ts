import { z } from "zod";

export const otpVerificationSchema = z.object({
	body: z.object({
		otp: z.string().length(4),
		email: z.string(),
	}),
});

export type OTPVerificationBody = z.infer<typeof otpVerificationSchema>["body"];

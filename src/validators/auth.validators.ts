import { z } from "zod";

export const adminLoginSchema = z.object({
	body: z.object({
		username: z.string({ message: "Username is required" }),
		password: z.string({ message: "Password is required" }),
	}),
});

export const userLoginSchema = z.object({
	body: z.object({
		email: z.string({ message: "Email is required" }),
		password: z.string({ message: "Password is required" }),
	}),
});

export const userForgotPasswordSchema = z.object({
	body: z.object({
		email: z.string({ message: "Email is required" }),
	}),
});

export const userResetPasswordSchema = z.object({
	body: z.object({
		new_password: z.string({ message: "New Password is required" }),
	}),
});

export type AdminLoginBodyData = z.infer<typeof adminLoginSchema>["body"];
export type UserLoginBodyData = z.infer<typeof userLoginSchema>["body"];
export type UserForgotPasswordBodyData = z.infer<
	typeof userForgotPasswordSchema
>["body"];

export type UserResetPasswordBodyData = z.infer<
	typeof userResetPasswordSchema
>["body"];

import { z } from "zod";

export const signupUserSchema = z.object({
	body: z.object({
		email: z.string({ message: "Email is required" }),
		password: z.string({ message: "Password is required" }),
		full_name: z.string({ message: "Full Name is required" }),
	}),
});

export const patchUserSchema = z.object({
	body: z.object({
		full_name: z.string({ message: "Full Name is required" }).optional(),
	}),
});

export type SignupUserBodyData = z.infer<typeof signupUserSchema>["body"];

export type PatchUserBodyData = z.infer<typeof patchUserSchema>["body"];
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
		full_name: z.string().optional(),
		phone_number: z.string().optional(),
	}),
});

export const userContactSchema = z.object({
	body: z.object({
		subject: z.string({ message: "Subject is required" }),
		message: z.string({ message: "Message is required" }),
	}),
});

export type SignupUserBodyData = z.infer<typeof signupUserSchema>["body"];

export type PatchUserBodyData = z.infer<typeof patchUserSchema>["body"];

export type UserContactBodyData = z.infer<typeof userContactSchema>["body"];

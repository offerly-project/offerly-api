import { z } from "zod";

export const signupUserSchema = z.object({
	body: z.object({
		email: z.string({ message: "Email is required" }),
		password: z.string({ message: "Password is required" }),
		full_name: z.string({ message: "Full Name is required" }),
	}),
});

export type SignupUserBodyData = z.infer<typeof signupUserSchema>["body"];
